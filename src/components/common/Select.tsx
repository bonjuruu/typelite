import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  optionList: SelectOption[];
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  dropUp: boolean;
}

export function Select({
  value,
  onChange,
  placeholder,
  optionList,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: 0,
    dropUp: false,
  });

  const selectedOption = optionList.find((o) => o.value === value) ?? null;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close when page scrolls (not the dropdown list itself)
  useEffect(() => {
    if (!open) return;
    function handleScroll(e: Event) {
      if (listRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [open]);

  // Clamp scroll inside dropdown to prevent rubber-band overscroll
  const touchStartY = useRef(0);
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (!list) return;
    function handleWheel(e: WheelEvent) {
      const maxScroll = list!.scrollHeight - list!.clientHeight;
      if (maxScroll <= 0) {
        e.preventDefault();
        return;
      }
      if (list!.scrollTop === 0 && e.deltaY < 0) {
        e.preventDefault();
      } else if (list!.scrollTop >= maxScroll && e.deltaY > 0) {
        e.preventDefault();
      }
    }
    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length === 1) {
        touchStartY.current = e.touches[0].clientY;
      }
    }
    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      const maxScroll = list!.scrollHeight - list!.clientHeight;
      if (maxScroll <= 0) {
        e.preventDefault();
        return;
      }
      const deltaY = touchStartY.current - e.touches[0].clientY;
      if (list!.scrollTop === 0 && deltaY < 0) {
        e.preventDefault();
      } else if (list!.scrollTop >= maxScroll && deltaY > 0) {
        e.preventDefault();
      }
    }
    list.addEventListener("wheel", handleWheel, { passive: false });
    list.addEventListener("touchstart", handleTouchStart, { passive: true });
    list.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      list.removeEventListener("wheel", handleWheel);
      list.removeEventListener("touchstart", handleTouchStart);
      list.removeEventListener("touchmove", handleTouchMove);
    };
  }, [open]);

  // Scroll focused item into view
  useEffect(() => {
    if (!open || focusIndex < 0 || !listRef.current) return;
    const items = listRef.current.children;
    if (items[focusIndex]) {
      (items[focusIndex] as HTMLElement).scrollIntoView({ block: "nearest" });
    }
  }, [focusIndex, open]);

  // Position the portal dropdown relative to the trigger button
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = Math.min(optionList.length * 36 + 8, 240);
    const dropUp = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    setPosition({
      top: dropUp ? rect.top - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      dropUp,
    });
  }, [optionList.length]);

  // Recalculate position on open
  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  function handleToggle() {
    if (!open) {
      const idx = optionList.findIndex((o) => o.value === value);
      setFocusIndex(idx >= 0 ? idx : 0);
    }
    setOpen((prev) => !prev);
  }

  function handleSelect(optionValue: string) {
    onChange(optionValue);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        const idx = optionList.findIndex((o) => o.value === value);
        setFocusIndex(idx >= 0 ? idx : 0);
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusIndex((prev) =>
          prev < optionList.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusIndex >= 0 && focusIndex < optionList.length) {
          handleSelect(optionList[focusIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Home":
        e.preventDefault();
        setFocusIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusIndex(optionList.length - 1);
        break;
    }
  }

  const dropdown = open
    ? createPortal(
        <ul
          ref={listRef}
          role="listbox"
          aria-activedescendant={
            focusIndex >= 0 ? `select-opt-${focusIndex}` : undefined
          }
          style={{
            position: "fixed",
            top: position.dropUp ? undefined : position.top,
            bottom: position.dropUp
              ? window.innerHeight - position.top
              : undefined,
            left: position.left,
            width: position.width,
            overscrollBehavior: "none",
          }}
          className="z-50 max-h-60 overflow-auto rounded border border-gray-600 bg-gray-800 py-1 shadow-lg shadow-black/40"
        >
          {optionList.map((option, idx) => {
            const isSelected = option.value === value;
            const isFocused = idx === focusIndex;
            return (
              <li
                key={option.value}
                id={`select-opt-${idx}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setFocusIndex(idx)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(option.value)}
                className={`flex cursor-pointer items-center px-3 py-1.5 text-sm transition-colors ${
                  isFocused
                    ? "bg-indigo-600/20 text-gray-100"
                    : "text-gray-300 hover:text-gray-100"
                } ${isSelected ? "font-medium text-indigo-300" : ""}`}
              >
                {isSelected && (
                  <svg
                    className="mr-2 h-3.5 w-3.5 shrink-0 text-indigo-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4-4a.75.75 0 011.06-1.06l3.366 3.365 7.505-9.875a.75.75 0 011.053-.057z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {!isSelected && <span className="mr-2 inline-block w-3.5" />}
                {option.label}
              </li>
            );
          })}
        </ul>,
        document.body,
      )
    : null;

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`flex w-full items-center justify-between rounded border px-3 py-2 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-gray-900 ${
          open
            ? "border-indigo-500 bg-gray-800"
            : "border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-650"
        }`}
      >
        <span className={selectedOption ? "text-gray-100" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`ml-2 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {dropdown}
    </div>
  );
}
