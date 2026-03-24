"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { ZONES } from "@/lib/constants";

const mockAdvertiserOptions = [
  { id: "adv-001", name: "Colmena Golden Cross" },
  { id: "adv-002", name: "Cruz Blanca" },
  { id: "adv-003", name: "Abbott Laboratories" },
  { id: "adv-004", name: "Novartis Chile" },
  { id: "adv-005", name: "MetLife Chile" },
  { id: "adv-006", name: "Bupa Chile" },
  { id: "adv-007", name: "Minsal Prevención" },
  { id: "adv-008", name: "Banmédica" },
  { id: "adv-009", name: "Pfizer Chile" },
  { id: "adv-010", name: "Clínica Yoga & Bienestar" },
];

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  advertiserId: z.string().min(1, "Advertiser is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  targetZones: z.array(z.string()).min(1, "Select at least one zone"),
  dailyFrequency: z.number().min(1, "Minimum 1 play per day").max(100, "Maximum 100 per day"),
  budgetCLP: z.number().min(0, "Must be a positive value"),
  cpmRate: z.number().min(0, "Must be a positive value"),
  notes: z.string().optional(),
});

type CampaignForm = z.infer<typeof campaignSchema>;

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:outline-none transition-colors";
const labelClass = "block text-sm font-medium text-slate-700";
const errorClass = "mt-1 text-xs text-red-600";

export default function NewCampaignPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      dailyFrequency: 10,
      budgetCLP: 0,
      cpmRate: 0,
      targetZones: [],
    },
  });

  const selectedZones = watch("targetZones") || [];

  function toggleZone(zone: string) {
    const current = selectedZones;
    if (current.includes(zone)) {
      setValue(
        "targetZones",
        current.filter((z) => z !== zone),
        { shouldValidate: true }
      );
    } else {
      setValue("targetZones", [...current, zone], { shouldValidate: true });
    }
  }

  function onSubmit(data: CampaignForm) {
    console.log("New campaign data:", data);
    alert("Campaign created (placeholder). Check console for data.");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-2">
          <Link href="/campaigns" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
            &larr; Back to Campaigns
          </Link>
        </div>

        <PageHeader
          title="Create Campaign"
          description="Set up a new advertising campaign with zone targeting"
        />

        <Card>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Campaign Name */}
              <div className="sm:col-span-2">
                <label htmlFor="name" className={labelClass}>
                  Campaign Name *
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className={inputClass}
                  placeholder="e.g. Plan Salud Premium Q1"
                />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>

              {/* Advertiser */}
              <div className="sm:col-span-2">
                <label htmlFor="advertiserId" className={labelClass}>
                  Advertiser *
                </label>
                <select id="advertiserId" {...register("advertiserId")} className={inputClass}>
                  <option value="">Select an advertiser</option>
                  {mockAdvertiserOptions.map((adv) => (
                    <option key={adv.id} value={adv.id}>
                      {adv.name}
                    </option>
                  ))}
                </select>
                {errors.advertiserId && <p className={errorClass}>{errors.advertiserId.message}</p>}
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className={labelClass}>
                  Start Date *
                </label>
                <input id="startDate" type="date" {...register("startDate")} className={inputClass} />
                {errors.startDate && <p className={errorClass}>{errors.startDate.message}</p>}
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className={labelClass}>
                  End Date *
                </label>
                <input id="endDate" type="date" {...register("endDate")} className={inputClass} />
                {errors.endDate && <p className={errorClass}>{errors.endDate.message}</p>}
              </div>

              {/* Daily Frequency */}
              <div>
                <label htmlFor="dailyFrequency" className={labelClass}>
                  Daily Frequency *
                </label>
                <input
                  id="dailyFrequency"
                  type="number"
                  min={1}
                  max={100}
                  {...register("dailyFrequency")}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-400">Plays per day per screen</p>
                {errors.dailyFrequency && <p className={errorClass}>{errors.dailyFrequency.message}</p>}
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budgetCLP" className={labelClass}>
                  Budget (CLP) *
                </label>
                <input
                  id="budgetCLP"
                  type="number"
                  {...register("budgetCLP")}
                  className={inputClass}
                  placeholder="0"
                />
                {errors.budgetCLP && <p className={errorClass}>{errors.budgetCLP.message}</p>}
              </div>

              {/* CPM Rate */}
              <div>
                <label htmlFor="cpmRate" className={labelClass}>
                  CPM Rate (CLP)
                </label>
                <input
                  id="cpmRate"
                  type="number"
                  {...register("cpmRate")}
                  className={inputClass}
                  placeholder="0"
                />
                <p className="mt-1 text-xs text-slate-400">Cost per 1,000 impressions</p>
                {errors.cpmRate && <p className={errorClass}>{errors.cpmRate.message}</p>}
              </div>
            </div>

            {/* Target Zones */}
            <div>
              <label className={labelClass}>Target Zones *</label>
              <p className="mt-1 text-xs text-slate-400">Select which zones will display this campaign</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ZONES.map((zone) => {
                  const isSelected = selectedZones.includes(zone);
                  return (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => toggleZone(zone)}
                      className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-blue-50 text-blue-700 ring-2 ring-blue-500"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span className="mr-2 inline-block h-3 w-3 rounded-sm border-2 align-middle" style={{
                        borderColor: isSelected ? "#2563eb" : "#cbd5e1",
                        backgroundColor: isSelected ? "#2563eb" : "transparent",
                      }} />
                      {zone}
                    </button>
                  );
                })}
              </div>
              {errors.targetZones && <p className={errorClass}>{errors.targetZones.message}</p>}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className={labelClass}>
                Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                {...register("notes")}
                className={inputClass}
                placeholder="Additional notes about this campaign..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/campaigns"
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Campaign"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
