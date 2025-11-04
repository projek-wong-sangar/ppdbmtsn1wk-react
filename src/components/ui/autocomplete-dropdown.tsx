import React, { useState, useRef, useEffect, useId } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutocompleteOption {
  id: number;
  nama: string;
}

interface AutocompleteDropdownProps {
  label: string;
  placeholder: string;
  options: AutocompleteOption[];
  value: string;
  onValueChange: (value: string) => void;
  onSelect: (option: AutocompleteOption | null) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  className?: string;
}

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  onSelect,
  disabled = false,
  loading = false,
  error,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.nama.toLowerCase().includes(value.toLowerCase())
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
    
    // If input is cleared, clear selection
    if (newValue === '') {
      onSelect(null);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: AutocompleteOption) => {
    onValueChange(option.nama);
    onSelect(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  // Handle clear button
  const handleClear = () => {
    onValueChange('');
    onSelect(null);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
        return;
      }
      if (e.key === 'Enter' || e.key === 'NumpadEnter') {
        // Select first option immediately when closed
        if (filteredOptions.length > 1) {
          e.preventDefault();
          handleOptionSelect(filteredOptions[0]);
          return;
        }
      }
      if (e.key === 'Tab') {
        // If there are options, select first before tabbing away
        if (filteredOptions.length > 1) {
          handleOptionSelect(filteredOptions[0]);
        }
        return;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
      case 'NumpadEnter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        } else if (filteredOptions.length > 0) {
          handleOptionSelect(filteredOptions[0]);
        }
        break;
      case 'Tab':
        // Select current (or first) option on Tab, then allow focus to move forward
        if (filteredOptions.length > 0) {
          const toSelect = highlightedIndex >= 0 && filteredOptions[highlightedIndex]
            ? filteredOptions[highlightedIndex]
            : filteredOptions[0];
          handleOptionSelect(toSelect);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Keep highlighted option in view when navigating with arrows
  useEffect(() => {
    if (highlightedIndex >= 0) {
      const el = optionRefs.current[highlightedIndex];
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  // Handle focus
  const handleFocus = () => {
    if (!disabled && !loading) {
      setIsOpen(true);
      if (filteredOptions.length > 0) {
        setHighlightedIndex(0);
      }
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When options change while open, ensure something is highlighted
  useEffect(() => {
    if (isOpen) {
      if (filteredOptions.length === 0) {
        setHighlightedIndex(-1);
      } else if (highlightedIndex === -1) {
        setHighlightedIndex(0);
      } else if (highlightedIndex > filteredOptions.length - 1) {
        setHighlightedIndex(filteredOptions.length - 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredOptions.length, isOpen]);

  return (
    <div className={cn("relative", className)}>
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={label.toLowerCase()}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={loading ? "Memuat..." : placeholder}
          disabled={disabled || loading}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0 && filteredOptions[highlightedIndex]
              ? `${listboxId}-option-${filteredOptions[highlightedIndex].id}`
              : undefined
          }
          className={cn(
            "pr-20",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        />
        
        {/* Clear button */}
        {value && !disabled && !loading && (
          <button
            type="button"
            onClick={handleClear}
            tabIndex={-1}
            aria-hidden="true"
            className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {/* Dropdown arrow */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || loading}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && !loading && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-auto"
          role="listbox"
          id={listboxId}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionSelect(option)}
                ref={el => (optionRefs.current[index] = el)}
                tabIndex={-1}
                className={cn(
                  "w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                  index === highlightedIndex && "bg-accent text-accent-foreground"
                )}
                role="option"
                id={`${listboxId}-option-${option.id}`}
                aria-selected={index === highlightedIndex}
              >
                {option.nama}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-muted-foreground text-sm">
              Tidak ada hasil ditemukan
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
};

export default AutocompleteDropdown;
