"use client";

import Link from "next/link";
import { type UserProfile, type BlogPost } from "@/lib/types";
import { getAuthorInitials } from "@/lib/utils/format";

type ProfileLinkUser = Pick<UserProfile, "id" | "username" | "fullName"> | BlogPost["author"];

export function UserProfileLink({
  user,
  labelClassName,
  replace = false,
}: {
  user: ProfileLinkUser;
  labelClassName?: string;
  replace?: boolean;
}) {
  return (
    <Link
      href={`/users/${user.username}`}
      replace={replace}
      className="group inline-flex items-center gap-3 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-bangers text-base text-primary-foreground">
        {getAuthorInitials(user.fullName)}
      </div>
      <div>
        <p className={`font-bangers text-2xl text-primary transition-colors group-hover:text-accent ${labelClassName ?? ""}`}>
          {user.fullName}
        </p>
        <p className="font-sans text-sm text-muted-foreground">@{user.username}</p>
      </div>
    </Link>
  );
}
