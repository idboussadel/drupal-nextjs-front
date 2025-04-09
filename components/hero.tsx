import Image from "next/image"
import { Link } from "@/components/navigation/Link"
import { absoluteUrl } from "@/lib/utils"
import type { DrupalBlock } from "next-drupal"

interface HeroProps {
  block: DrupalBlock
  className?: string
}

export function Hero({ block, className }: HeroProps) {
  return (
    <div className={`relative isolate overflow-hidden bg-white ${className}`}>
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="pattern"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect fill="url(#pattern)" width="100%" height="100%" strokeWidth={0} />
      </svg>

      <div className="mx-auto max-w-7xl pb-24 pt-10 lg:flex">
        {/* Left Content Column */}
        <div className="mx-auto max-w-3xl lg:mt-28 lg:mx-0 lg:shrink-0 lg:pt-8">
          {/* Title */}
          <h1 className="mt-12 text-pretty text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            {block.field_title || "Deploy to the cloud with confidence"}
          </h1>

          {/* Body Text */}
          {block.body?.processed && (
            <p
              className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8"
              dangerouslySetInnerHTML={{ __html: block.body.processed }}
            />
          )}

          {/* Buttons */}
          <div className="mt-10 flex items-center gap-x-6">
            {block.field_link?.uri && (
              <Link
                href={block.field_link.uri}
                className="rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {block.field_link.title || "Get started"}
              </Link>
            )}
          </div>
        </div>

        {/* Right Image Column */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-6 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              {block.field_image?.filename && (
                <Image
                  src={absoluteUrl(`${block.field_image.uri.url}`)}
                  alt={block.field_image.resourceIdObjMeta.alt || ""}
                  width={2432}
                  height={600}
                  className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
