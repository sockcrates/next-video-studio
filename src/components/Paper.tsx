import classNames from "classnames";

export function Paper({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={classNames(
        "rounded-lg bg-gray-100 dark:bg-gray-800 p-4 shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
