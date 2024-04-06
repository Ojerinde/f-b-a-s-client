/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-shadow */

"use client"

import React, { useState } from "react"
import Select, { StylesConfig } from "react-select"
import Image from "next/image"

interface Option {
  value: string
  label: string
}

interface SelectFieldProps {
  label?: string
  // eslint-disable-next-line no-unused-vars
  onChange: (selectedOption: Option | null) => void
  value: any
  options: Option[]
  labels?: boolean
  placeholder?: string
}

const SelectField: React.FC<SelectFieldProps> = ({
  onChange,
  value,
  options,
  label,
  placeholder = "",
}) => {
  const [optionsIsShown, setOptionsIsShown] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<Option | null>(value)

  const customStyles: StylesConfig<Option, boolean> = {
    control: (provided, state) => ({
      ...provided,
      // boxShadow: state.isFocused ? "0 0 0 2px #7949FF" : "0 0 0 2px #9D9D9D",
      fontSize: "1.5rem",
      borderColor: state.isFocused ? "#7949FF" : "#9D9D9D",
      borderWidth: state.isFocused ? "2px" : "1px",
      "&:hover": {
        cursor: "pointer",
        borderColor: state.isFocused ? " #7949FF" : "#44607c",
      },
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      paddingLeft: "10px",
      paddingRight: "10px",
    }),
    // eslint-disable-next-line no-unused-vars
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: "1.6rem",
      color: "#1a1a1a",
      backgroundColor: "white",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "#F2F2F2",
        color: "#1a1a1a",
      },
    }),
    menu: (provided) => ({
      ...provided,
      background: "#fff",
      boxShadow: "0px 0px 24px 0px rgba(0, 0, 0, 0.20)",
    }),
  }

  const toggleOptions = () => {
    setOptionsIsShown((prevState) => !prevState)
  }

  const handleInputChange = (selectedOption: any) => {
    setSelectedOption(selectedOption)
    setOptionsIsShown(false)
    onChange(selectedOption)
  }

  const handleBlur = () => {
    setOptionsIsShown(false)
  }

  const handleInputClick = () => {
    setOptionsIsShown(true)
  }

  return (
    <div className="">
      {label && <label>{label}: </label>}
      <Select
        styles={customStyles}
        components={{
          DropdownIndicator: () => (
            <div
              onClick={toggleOptions}
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
            >
              {optionsIsShown ? (
                <Image
                  src="/icons/arrow/chevron_up.svg"
                  width={24}
                  height={24}
                  alt="selected-icon"
                />
              ) : (
                <Image
                  src="/icons/arrow/chevron_down.svg"
                  width={24}
                  height={24}
                  alt="unselected-icon"
                />
              )}
            </div>
          ),
          IndicatorSeparator: () => null,
        }}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleInputClick}
        value={selectedOption}
        options={options}
        placeholder={placeholder}
        menuIsOpen={optionsIsShown}
      />
    </div>
  )
}

export default SelectField
