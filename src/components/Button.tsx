"use client";

import classNames from "classnames";
import { memo, type ComponentPropsWithoutRef } from "react";

export const Button = memo(
  ({ children, className, ...props }: ComponentPropsWithoutRef<"button">) => (
    <button
      className={classNames(
        "rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 disabled:bg-gray-400 dark:disabled:bg-gray-800 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
