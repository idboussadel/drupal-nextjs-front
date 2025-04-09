import { drupal } from "@/lib/drupal"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react"
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline"
import { DrupalBlock } from "next-drupal"

export default async function Faqs() {
  const faqBlocks = await drupal.getResource<DrupalBlock>(
    "block_content/faqs",
    "796da069-a78b-4e22-917a-8f7872cd4339",
    {
      params: {
        include: "field_item",
      },
    }
  )
  if (faqBlocks.field_item?.length < 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <p>No FAQ content found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[75rem] py-24 sm:py-32 lg:py-40">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            {faqBlocks.field_faqs_title || "Frequently asked questions"}
          </h2>
          <dl className="mt-16 divide-y divide-gray-900/10">
            {faqBlocks.field_item?.map((faq, index) => (
              <Disclosure
                key={index}
                as="div"
                className="py-6 first:pt-0 last:pb-0"
              >
                <dt>
                  <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                    <span className="text-lg font-semibold">
                      {faq.field_title}
                    </span>
                    <span className="ml-6 flex h-7 items-center">
                      <PlusSmallIcon
                        aria-hidden="true"
                        className="size-6 group-data-[open]:hidden"
                      />
                      <MinusSmallIcon
                        aria-hidden="true"
                        className="size-6 group-[&:not([data-open])]:hidden"
                      />
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="mt-2 pr-12">
                  <div
                    className="text-base text-gray-600"
                    dangerouslySetInnerHTML={{ __html: faq.field_description }}
                  />
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
