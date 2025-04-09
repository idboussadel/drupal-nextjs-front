import Clients from "@/components/clients"
import { ArticleTeaser } from "@/components/drupal/ArticleTeaser"
import Faqs from "@/components/faqs"
import Footer from "@/components/footer"
import { Hero } from "@/components/hero"
import PricingBlock from "@/components/pricing"
import Stats from "@/components/stats"
import { drupal } from "@/lib/drupal"
import type { Metadata } from "next"
import type { DrupalBlock, DrupalNode } from "next-drupal"

export const metadata: Metadata = {
  description: "A Next.js site powered by a Drupal backend.",
}

interface PricingItem {
  field__pricing_title: string
  field_pricing: number
  field_advantages: {
    type: string
    id: string
    field_advantage: string
  }[]
}

interface PricingBlockData extends DrupalBlock {
  field_advantages: PricingItem[]
}

export default async function Home() {
  const heroBlock = await drupal.getResource<DrupalBlock>(
    "block_content/hero",
    "2d59b0a5-9d79-4256-914a-8ba7c1751c18",
    {
      params: {
        include: "field_image",
      },
    }
  )

  const nodes = await drupal.getResourceCollection<DrupalNode[]>(
    "node--article",
    {
      params: {
        "filter[status]": 1,
        "fields[node--article]": "title,path,field_image,uid,created",
        include: "field_image,uid",
        sort: "-created",
        "page[limit]": 3,
      },
      next: {
        revalidate: 0,
      },
    }
  )

  const block = await drupal.getResource<PricingBlockData>(
    "block_content/pricing",
    "2ca4fdf1-02e1-4f0b-a00f-43055ebb678f",
    {
      params: {
        include: "field_advantages,field_advantages.field_advantages",
      },
    }
  )

  return (
    <>
      {heroBlock && <Hero block={heroBlock} />}
      <Stats />
      <h2 className="mb-10 mt-28 max-w-[75rem] mx-auto text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
        Latest Articles.
      </h2>
      {nodes?.length ? (
        <div className="grid  max-w-[75rem] mx-auto grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {nodes.map((node) => (
            <div key={node.id}>
              <div key={node.id} className="h-96">
                <ArticleTeaser node={node} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-4">No nodes found</p>
      )}
      <Faqs />
      <PricingBlock block={block} />
      <Clients />
      <Footer />
    </>
  )
}
