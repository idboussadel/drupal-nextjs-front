import { drupal } from "@/lib/drupal"
import Image from "next/image"
import { absoluteUrl } from "@/lib/utils"

export default async function Clients() {
  const block = await drupal.getResource(
    "block_content/clients_section",
    "64650fc9-ee72-444b-bcf9-47dda787ff7c",
    {
      params: {
        include: "field_clients,field_clients.field_client_image",
      },
    }
  )

  if (!block?.field_clients?.length) {
    return (
      <div className="bg-white py-24 sm:py-32 text-center">
        <p>No clients data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white pt-24 pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-2xl mb-2 text-center font-semibold tracking-tight text-gray-900">
          {block.field_clients_title}
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {block.field_clients.map((client, index) => {
            return (
              <Image
                key={client.id}
                src={absoluteUrl(client.field_client_image.uri.url)}
                alt={
                  client.field_client_image.resourceIdObjMeta?.alt ||
                  "Client logo"
                }
                width={158}
                height={48}
                className={`col-span-2 max-h-[4.8rem] w-full object-contain ${
                  index >= 3 && index < 5 ? "sm:col-start-2" : ""
                } ${index >= 4 ? "col-start-2 sm:col-start-auto" : ""} lg:col-span-1`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
