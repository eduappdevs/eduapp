import React from "react";

export default function Input({
  type,
  id,
  className,
  autoComplete,
  placeholder,
  disabled,
}) {
  return (
    <input
      type={type}
      id={id}
      className={className}
      autoComplete={autoComplete}
      placeholder={String(placeholder)}
      disabled={disabled}
    />
  );
}
