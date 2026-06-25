'use client'

import { useEffect, useRef, useState } from 'react'

export function OptionPicker({
  id,
  label,
  value,
  options,
  disabled = false,
  onChange,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const selected = options.find((opt) => opt.value === value)

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', closeOnOutside)
    return () => document.removeEventListener('mousedown', closeOnOutside)
  }, [])

  useEffect(() => {
    if (disabled) setOpen(false)
  }, [disabled])

  return (
    <div className="controlGroup" ref={rootRef}>
      <span className="controlLabel" id={`${id}-label`}>
        {label}
      </span>
      <div className={`optionPicker ${open ? 'optionPickerOpen' : ''}`}>
        <button
          type="button"
          id={id}
          className="optionPickerTrigger"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${id}-label`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>{selected?.label ?? '—'}</span>
          <svg className="optionPickerChevron" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M7 10l5 5 5-5H7z"
            />
          </svg>
        </button>
        {open && (
          <ul className="optionPickerMenu" role="listbox" aria-labelledby={`${id}-label`}>
            {options.map((opt) => (
              <li key={opt.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  className={`optionPickerItem ${
                    opt.value === value ? 'optionPickerItemActive' : ''
                  }`}
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
