import clearIcon from "@/assets/icons/clear_button.svg";
import { cn } from "@/lib/utils";
import * as React from "react";

type FormFieldState = "default" | "focused" | "typing" | "filled" | "error";

interface FormFieldProps extends Omit<React.ComponentProps<"input">, "size"> {
  label?: string;
  helperText?: string;
  errorText?: string;
  state?: FormFieldState;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      state = "default",
      value,
      placeholder,
      onChange,
      ...props
    },
    ref,
  ) => {
    const hasValue = value !== undefined && value !== "";
    const derivedState: FormFieldState =
      state === "default" && hasValue ? "filled" : state;

    const isActive = derivedState === "focused" || derivedState === "typing";
    const isError = derivedState === "error";
    const isFilled = derivedState === "filled";
    const showValue = isActive || isFilled || isError;

    const textFieldClasses = cn(
      "bg-fill-normal flex items-center h-[65px] w-full px-4 rounded-xl gap-2",
      isActive && "border border-line-strong",
      isError && "border border-negative",
    );

    const inputClasses = cn(
      "bg-transparent outline-none w-full text-base font-medium leading-[1.35]",
      showValue ? "text-label-strong" : "text-label-assistive",
      "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--color-fill-normal)] [&:-webkit-autofill]:[~-webkit-text-fill-color:var(--color-label-strong)]",
    );

    return (
      <div className={cn("flex flex-col gap-1.5 items-start w-full", className)}>
        <div className={textFieldClasses}>
          <div className="flex flex-col gap-1 items-start flex-1 min-w-0">
            {label && (
              <p className="text-label-neutral text-xs font-medium leading-[1.2] truncate">
                {label}
              </p>
            )}
            <input
              ref={ref}
              value={value}
              placeholder={placeholder ?? "Text input"}
              className={inputClasses}
              onChange={onChange}
              {...props}
            />
          </div>
          {hasValue && (
            <button
              type="button"
              className="shrink-0 size-6 flex items-center justify-center cursor-pointer"
              onClick={() => {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                  window.HTMLInputElement.prototype,
                  "value",
                )?.set;
                if (nativeInputValueSetter && ref) {
                  if (typeof ref === "function") {
                    const inputEl = (document.getElementById(props.id ?? "") as HTMLInputElement | null) ?? ref;
                    if (inputEl instanceof HTMLInputElement) {
                      nativeInputValueSetter.call(inputEl, "");
                      inputEl.dispatchEvent(new Event("input", { bubbles: true }));
                    }
                  } else if ("current" in ref && ref.current) {
                    nativeInputValueSetter.call(ref.current, "");
                    ref.current.dispatchEvent(new Event("input", { bubbles: true }));
                  }
                }
                onChange?.({
                  target: { value: "" },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            >
              <img src={clearIcon} alt="지우기" className="size-4" />
            </button>
          )}
        </div>
        {isError && errorText ? (
          <div className="px-2 w-full">
            <p className="text-negative text-xs font-medium leading-[1.2]">
              {errorText}
            </p>
          </div>
        ) : helperText ? (
          <div className="px-2 w-full">
            <p className="text-label-neutral text-xs font-medium leading-[1.2]">
              {helperText}
            </p>
          </div>
        ) : null}
      </div>
    );
  },
);

FormField.displayName = "FormField";

export { FormField };
export type { FormFieldProps, FormFieldState };
