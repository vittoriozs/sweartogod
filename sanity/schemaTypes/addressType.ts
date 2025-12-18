import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const addressType = defineType({
  name: "address",
  title: "Addresses",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Address Name",
      type: "string",
      description: "A friendly name for this address (e.g. Home, Work)",
      validation: (Rule) => Rule.required().max(50),
    }),

    defineField({
      name: "email",
      title: "User Email",
      type: "email",
    }),

    defineField({
      name: "address",
      title: "Full Address",
      type: "string",
      description:
        "Enter the full address (Street, No., RT/RW, Complex if any)",
      validation: (Rule) => Rule.required().min(5).max(200),
    }),

    defineField({
      name: "kelurahan",
      title: "Kelurahan",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "kecamatan",
      title: "Kecamatan",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "city",
      title: "City / Regency (Kota / Kabupaten)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "province",
      title: "Province",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "postalCode",
      title: "Postal Code (Kode Pos)",
      type: "string",
      description: "5 digit postal code (e.g. 40286)",
      validation: (Rule) =>
        Rule.required().regex(/^\d{5}$/, {
          name: "postalCode",
          invert: false,
        }),
    }),

    defineField({
      name: "default",
      title: "Default Address",
      type: "boolean",
      description: "Is this the default shipping address?",
      initialValue: false,
    }),

    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "address",
      city: "city",
      province: "province",
      isDefault: "default",
    },
    prepare({ title, subtitle, city, province, isDefault }) {
      return {
        title: `${title} ${isDefault ? "(Default)" : ""}`,
        subtitle: `${subtitle}, ${city}, ${province}`,
      };
    },
  },
});
