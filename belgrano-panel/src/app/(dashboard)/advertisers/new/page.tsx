"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

const advertiserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  category: z.enum(["ISAPRE", "Pharma", "Insurance", "Wellness", "Other"]),
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z.email("Invalid email address"),
  contactPhone: z.string().optional(),
  contractStartDate: z.string().min(1, "Start date is required"),
  contractEndDate: z.string().min(1, "End date is required"),
  contractValue: z.number().min(0, "Must be a positive value"),
  notes: z.string().optional(),
});

type AdvertiserForm = z.infer<typeof advertiserSchema>;

const categoryOptions = [
  { value: "ISAPRE", label: "ISAPRE" },
  { value: "Pharma", label: "Pharma" },
  { value: "Insurance", label: "Insurance" },
  { value: "Wellness", label: "Wellness" },
  { value: "Other", label: "Other" },
];

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors";
const inputErrorClass =
  "mt-1 block w-full rounded-lg border border-red-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-colors border-l-4 border-l-red-500";
const labelClass = "block text-sm font-medium text-slate-700";
const errorClass = "mt-1 text-xs text-red-600";

export default function NewAdvertiserPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdvertiserForm>({
    resolver: zodResolver(advertiserSchema),
    defaultValues: {
      category: "ISAPRE",
      contractValue: 0,
    },
  });

  function onSubmit(data: AdvertiserForm) {
    console.log("New advertiser data:", data);
    alert("Advertiser created (placeholder). Check console for data.");
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/advertisers"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            &larr; Back to Advertisers
          </Link>
        </div>

        <PageHeader
          title="Add Advertiser"
          description="Create a new advertiser account and contract"
        />

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label htmlFor="name" className={labelClass}>
                  Advertiser Name *
                </label>
                <input id="name" type="text" {...register("name")} className={errors.name ? inputErrorClass : inputClass} placeholder="e.g. Colmena Golden Cross" />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className={labelClass}>
                  Company *
                </label>
                <input id="company" type="text" {...register("company")} className={errors.company ? inputErrorClass : inputClass} placeholder="e.g. Colmena" />
                {errors.company && <p className={errorClass}>{errors.company.message}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className={labelClass}>
                  Category *
                </label>
                <select id="category" {...register("category")} className={errors.category ? inputErrorClass : inputClass}>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className={errorClass}>{errors.category.message}</p>}
              </div>

              {/* Contact Name */}
              <div>
                <label htmlFor="contactName" className={labelClass}>
                  Contact Name *
                </label>
                <input id="contactName" type="text" {...register("contactName")} className={errors.contactName ? inputErrorClass : inputClass} placeholder="Full name" />
                {errors.contactName && <p className={errorClass}>{errors.contactName.message}</p>}
              </div>

              {/* Contact Email */}
              <div>
                <label htmlFor="contactEmail" className={labelClass}>
                  Contact Email *
                </label>
                <input id="contactEmail" type="email" {...register("contactEmail")} className={errors.contactEmail ? inputErrorClass : inputClass} placeholder="email@company.cl" />
                {errors.contactEmail && <p className={errorClass}>{errors.contactEmail.message}</p>}
              </div>

              {/* Contact Phone */}
              <div>
                <label htmlFor="contactPhone" className={labelClass}>
                  Contact Phone
                </label>
                <input id="contactPhone" type="tel" {...register("contactPhone")} className={inputClass} placeholder="+56 9 1234 5678" />
              </div>

              {/* Contract Start Date */}
              <div>
                <label htmlFor="contractStartDate" className={labelClass}>
                  Contract Start Date *
                </label>
                <input id="contractStartDate" type="date" {...register("contractStartDate")} className={errors.contractStartDate ? inputErrorClass : inputClass} />
                {errors.contractStartDate && <p className={errorClass}>{errors.contractStartDate.message}</p>}
              </div>

              {/* Contract End Date */}
              <div>
                <label htmlFor="contractEndDate" className={labelClass}>
                  Contract End Date *
                </label>
                <input id="contractEndDate" type="date" {...register("contractEndDate")} className={errors.contractEndDate ? inputErrorClass : inputClass} />
                {errors.contractEndDate && <p className={errorClass}>{errors.contractEndDate.message}</p>}
              </div>

              {/* Contract Value */}
              <div>
                <label htmlFor="contractValue" className={labelClass}>
                  Contract Value (CLP) *
                </label>
                <input id="contractValue" type="number" {...register("contractValue")} className={errors.contractValue ? inputErrorClass : inputClass} placeholder="0" />
                {errors.contractValue && <p className={errorClass}>{errors.contractValue.message}</p>}
              </div>
            </div>

            {/* Notes - full width */}
            <div className="mt-6">
              <label htmlFor="notes" className={labelClass}>
                Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                {...register("notes")}
                className={inputClass}
                placeholder="Additional notes about the advertiser or contract..."
              />
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-end gap-3">
              <Link
                href="/advertisers"
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Advertiser"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
