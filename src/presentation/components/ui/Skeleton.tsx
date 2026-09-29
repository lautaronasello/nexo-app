import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge(
        clsx('animate-pulse rounded-lg bg-secondary/15', className),
      )}
      {...props}
    />
  );
}
