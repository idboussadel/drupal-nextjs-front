"use client"

import { useState } from "react"
import { Radio, RadioGroup } from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/20/solid"
import { DrupalBlock } from "next-drupal"

interface PricingItem {
  field__pricing_title: string
  field_pricing: number
  field_advantages: {
    type: string
    id: string
    field_advantage: string
  }[]
}

interface PricingBlock extends DrupalBlock {
  field_advantages: PricingItem[]
  field_pricing_title: string
  field_description: string
}

export default function PricingBlock({ block }: { block: PricingBlock }) {
  const frequencies = [
    { value: "monthly", label: "Monthly" },
    { value: "annually", label: "Annually" },
  ]
  const [frequency, setFrequency] = useState(frequencies[0])

  if (!block?.field_advantages?.length) {
    return <div className="py-12 text-center">No pricing data available</div>
  }

  // Transform Drupal data to match the template structure
  const tiers = block.field_advantages.map((item) => ({
    name: item.field__pricing_title,
    id: `tier-${item.field__pricing_title.toLowerCase().replace(/\s+/g, "-")}`,
    href: "#",
    featured: item.field__pricing_title === "Elite Kit",
    description: `${item.field__pricing_title} plan with comprehensive features`,
    price: {
      monthly: `$${item.field_pricing}`,
      annually: `$${Math.round(item.field_pricing * 12 * 0.8)}`, // discount for annual
    },
    highlights: item.field_advantages.map(
      (advantage) => advantage.field_advantage
    ),
  }))

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ")
  }

  return (
    <div className="isolate overflow-hidden bg-gray-900">
      <div className="flow-root bg-gray-900 py-16 sm:pt-32 lg:pb-0">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative z-10">
            <h1 className="mx-auto max-w-4xl text-center text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              {block.field_pricing_title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-gray-400 sm:text-xl">
              {block.field_description}
            </p>

            <div className="mt-16 flex justify-center">
              <RadioGroup
                value={frequency}
                onChange={setFrequency}
                className="grid grid-cols-2 mb-4 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs font-semibold text-white"
              >
                {frequencies.map((option) => (
                  <Radio
                    key={option.value}
                    value={option}
                    className={classNames(
                      frequency.value === option.value ? "bg-indigo-500" : "",
                      "cursor-pointer rounded-full px-2.5 py-1"
                    )}
                  >
                    {option.label}
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="relative mx-auto mt-10 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:-mb-14 lg:max-w-none lg:grid-cols-3">
            <svg
              viewBox="0 0 1208 1024"
              aria-hidden="true"
              className="absolute -bottom-48 left-1/2 h-[64rem] -translate-x-1/2 translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] lg:-top-48 lg:bottom-auto lg:translate-y-0"
            >
              <ellipse
                cx={604}
                cy={512}
                rx={604}
                ry={512}
                fill="url(#d25c25d4-6d43-4bf9-b9ac-1842a30a4867)"
              />
              <defs>
                <radialGradient id="d25c25d4-6d43-4bf9-b9ac-1842a30a4867">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>

            <div
              aria-hidden="true"
              className="hidden lg:absolute lg:inset-x-px lg:bottom-0 lg:top-4 lg:block lg:rounded-t-2xl lg:bg-gray-800/80 lg:ring-1 lg:ring-white/10"
            />

            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={classNames(
                  tier.featured
                    ? "z-10 bg-white -mt-6 shadow-xl ring-1 ring-gray-900/10"
                    : "bg-gray-800/80 ring-1 ring-white/10 lg:bg-transparent lg:pb-14 lg:ring-0",
                  "relative rounded-2xl"
                )}
              >
                <div className="p-8 lg:pt-12 xl:p-10 xl:pt-14">
                  <h2
                    id={tier.id}
                    className={classNames(
                      tier.featured ? "text-gray-900 " : "text-white",
                      "text-sm font-semibold"
                    )}
                  >
                    {tier.name}
                  </h2>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch">
                    <div className="mt-2 flex items-center gap-x-4">
                      <p
                        className={classNames(
                          tier.featured ? "text-gray-900" : "text-white",
                          "text-4xl font-semibold tracking-tight"
                        )}
                      >
                        {tier.price[frequency.value]}
                      </p>
                      <div className="text-sm">
                        <p
                          className={
                            tier.featured ? "text-gray-900" : "text-white"
                          }
                        >
                          USD
                        </p>
                        <p
                          className={
                            tier.featured ? "text-gray-500" : "text-gray-400"
                          }
                        >
                          Billed {frequency.value}
                        </p>
                      </div>
                    </div>
                    <a
                      href={tier.href}
                      aria-describedby={tier.id}
                      className={classNames(
                        tier.featured
                          ? "bg-indigo-600 shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600"
                          : "bg-white/10 hover:bg-white/20 focus-visible:outline-white",
                        "rounded-md px-3 py-2 text-center text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      )}
                    >
                      Buy this plan
                    </a>
                  </div>
                  <div className="mt-8 flow-root sm:mt-10">
                    <ul
                      role="list"
                      className={classNames(
                        tier.featured
                          ? "divide-gray-900/5 border-gray-900/5 text-gray-600"
                          : "divide-white/5 border-white/5 text-white",
                        "-my-2 divide-y border-t text-sm lg:border-t-0"
                      )}
                    >
                      {tier.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-x-3 py-2">
                          <CheckIcon
                            aria-hidden="true"
                            className={classNames(
                              tier.featured
                                ? "text-indigo-600"
                                : "text-gray-500",
                              "h-6 w-5 flex-none"
                            )}
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-4xl text-center"></div>
        </div>
      </div>
    </div>
  )
}
