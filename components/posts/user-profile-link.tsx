"use client";

import Link from "next/link";
import Image from "next/image";
import { type UserProfile, type BlogPost } from "@/lib/types";
import { getAuthorInitials } from "@/lib/utils/format";
import { getRenderableImageUrl } from "@/lib/utils/image-url";

type ProfileLinkUser = (Pick<UserProfile, "id" | "username" | "fullName" | "profileImage">) | BlogPost["author"];

export function UserProfileLink({
  user,
  labelClassName,
  replace = false,
}: {
  user: ProfileLinkUser;
  labelClassName?: string;
  replace?: boolean;
}) {
  const profileImageUrl = getRenderableImageUrl(user.profileImage);

  return (
    <Link
      href={`/users/${user.username}`}
      replace={replace}
      className="group inline-flex items-center gap-3 transition-transform hover:-translate-y-0.5"
    >
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt={user.fullName}
            fill
            sizes="44px"
            className="object-cover"
          />
        ) : (
          <span className="font-bangers text-base text-background">
            {getAuthorInitials(user.fullName)}
          </span>
        )}
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
