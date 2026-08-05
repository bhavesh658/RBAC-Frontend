import React, { useState, useRef, useEffect } from "react";

function SearchableDropdown({
  label = "Search",
  placeholder = "Type to search...",
  options = [],
  value = "",
  onSelect,
  disabled = false
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedItem = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    (opt.subLabel && opt.subLabel.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelect = (item) => {
    onSelect(item.value); 
    setSearch(""); 
    setIsOpen(false); 
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onSelect("");
    setSearch("");
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      {label && <label className="form-label text-muted small fw-semibold mb-1">{label}</label>}

      {/* Main Input Field */}
      <div className="input-group">
        <span className="input-group-text bg-light text-muted border-end-0">
          <i className="bi bi-search"></i>
        </span>
        
        <input
          type="text"
          className="form-control bg-light border-start-0 shadow-none"
          placeholder={selectedItem ? selectedItem.label : placeholder}
          value={isOpen ? search : (selectedItem ? selectedItem.label : "")}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            if (value) onSelect(""); 
          }}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
        />
        
        {/* Clear Button (Cross Icon) */}
        {value && !isOpen && (
          <span
            className="input-group-text bg-light border-start-0"
            style={{ cursor: "pointer" }}
            onClick={handleClear}
            title="Clear selection"
          >
            <i className="bi bi-x-circle-fill text-secondary hover-danger"></i>
          </span>
        )}
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <ul
          className="list-group position-absolute w-100 shadow-lg rounded-3 border-0 mt-1"
          style={{ zIndex: 1050, maxHeight: "220px", overflowY: "auto", top: "100%" }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt.value}
                className="list-group-item list-group-item-action border-0 border-bottom d-flex align-items-center gap-3 py-2"
                style={{ cursor: "pointer", transition: "0.2s" }}
                onClick={() => handleSelect(opt)}
              >
                {/* Generic Avatar */}
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm"
                  style={{ width: "35px", height: "35px", backgroundColor: "#2c3e50", fontSize: "14px", flexShrink: 0 }}
                >
                  {opt.avatar || opt.label.charAt(0).toUpperCase()}
                </div>
                
                {/* Text Info */}
                <div className="text-truncate">
                  <div className="fw-bold text-dark fs-6 lh-sm text-truncate">{opt.label}</div>
                  {opt.subLabel && <div className="small text-muted lh-sm text-truncate">{opt.subLabel}</div>}
                </div>
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted small text-center py-4 border-0">
              <i className="bi bi-inbox fs-4 d-block mb-1"></i> No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default SearchableDropdown;