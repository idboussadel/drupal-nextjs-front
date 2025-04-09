import Image from "next/image"
import { Link } from "@/components/navigation/Link"
import { absoluteUrl, formatDate } from "@/lib/utils"
import type { DrupalNode } from "next-drupal"

interface ArticleTeaserProps {
  node: DrupalNode
  className?: string
}

export function ArticleTeaser({
  node,
  className,
  ...props
}: ArticleTeaserProps) {
  return (
    <article
      className={`relative isolate min-h-[436px] flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80 group ${className}`}
      {...props}
    >
      {/* Background Image Container with Hover Effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {node.field_image && (
          <Image
            src={absoluteUrl(node.field_image.uri.url)}
            alt={node.field_image.resourceIdObjMeta.alt}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        )}
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40 transition-opacity duration-300 hover:opacity-70" />
      <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300">
        <time dateTime={node.created} className="mr-8">
          {formatDate(node.created)}
        </time>

        {node.uid?.display_name && (
          <div className="-ml-4 flex items-center gap-x-4">
            <svg
              viewBox="0 0 2 2"
              className="-ml-0.5 size-0.5 flex-none fill-white/50"
            >
              <circle r={1} cx={1} cy={1} />
            </svg>
            <div className="flex gap-x-2.5">
              {node.uid?.user_picture && (
                <Image
                  src={absoluteUrl(node.uid.user_picture.uri.url)}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 flex-none h-full rounded-full bg-white/10"
                />
              )}
              {node.uid.display_name}
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-3 text-lg/6 font-semibold text-white">
        <Link href={node.path.alias} className="no-underline">
          <span className="absolute inset-0" />
          {node.title}
        </Link>
      </h3>
    </article>
  )
}
