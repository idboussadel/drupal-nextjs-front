import { drupal } from "@/lib/drupal"
import { DrupalBlock } from "next-drupal"

interface StatsParagraph {
  field_number: string
  field_stats_title: string
}

interface StatsBlock extends DrupalBlock {
  field_stats_item: StatsParagraph[]
}

export default async function StatsSection() {
  const block = await drupal.getResource<StatsBlock>(
    "block_content/stats",
    "5e177b70-cef8-4914-bfb9-e97c26519e67",
    {
      params: {
        include: "field_stats_item",
      },
    }
  )

  if (!block?.field_stats_item?.length) {
    return (
      <div className="bg-gray-900 py-24 sm:py-32 text-center">
        <p className="text-red-500">No stats data available</p>
      </div>
    )
  }

  const stats = block.field_stats_item.map((item) => ({
    id: item.id,
    name: item.field_stats_title,
    value: item.field_number,
  }))

  return (
    <div className="bg-gray-900 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="mx-auto flex max-w-xs flex-col gap-y-4"
            >
              <dt className="text-base/7 text-gray-400">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
