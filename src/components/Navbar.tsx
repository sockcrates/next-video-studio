"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

enum Routes {
  HOME = "/",
  VIDEO_EDITOR = "/videos",
}

export function Navbar() {
  const pathname = usePathname();
  const videoEditorSlug = new RegExp(`${Routes.VIDEO_EDITOR}(/\\w+)?$`);
  const isVideoEditorPage = videoEditorSlug.test(pathname);
  return (
    <nav className="flex gap-5 w-fit p-4">
      <Link
        className={classNames("text-lg font-bold", {
          "border-b-5": pathname === Routes.HOME,
        })}
        href={Routes.HOME}
      >
        Home
      </Link>
      <Link
        className={classNames("text-nowrap text-lg font-bold", {
          "border-b-5": isVideoEditorPage,
        })}
        href={Routes.VIDEO_EDITOR}
      >
        Video Editor
      </Link>
    </nav>
  );
}
