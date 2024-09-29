"use client";

import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { Country, State } from "country-state-city";

import Button from "@/components/button";
import Input from "@/components/shared/Input";
import Select from "@/components/shared/Select";
import { updateUserData } from "@/actions/users";
import FileUploader from "@/components/file-dropzone";

import { updateShop } from "@/actions/shops";
import LocationMap from "@/components/location-map";

type Props = {
  shopAdminData: {
    id: string;
    name: string | null | undefined;
    email: string | undefined;
    phoneNumber: string | null | undefined;
    otherPhone: string | null | undefined;
    commercialRegistrationNumber: string | null | undefined;
    website: string | null | undefined;
    image: string | null | undefined;
  };
  shopData: {
    id: string;
    name: string | null | undefined;
    logo: string | null | undefined;
    iban: string | null | undefined;
    accountNumber: string | null | undefined;
    bankName: string | null | undefined;
    country: string | null | undefined;
    city: string | null | undefined;
    district: string | null | undefined;
    location: MapLocation | null | undefined;
    songPrice: number;
  };
};

const SettingsMain = ({ shopAdminData, shopData }: Props) => {
  const t = useTranslations();
  const [countries, setCountries] = useState<
    Array<{ value: string; title: string }>
  >([]);
  const [cities, setCities] = useState<Array<{ value: string; title: string }>>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  type Inputs = {
    // Shop Owner Data
    name: string;
    email: string;
    phoneNumber: string;
    otherPhone: string;
    commercialRegistrationNumber: string;
    website: string;
    image: string;
    password: string;
    confirmPassword: string;
    // Shop Data
    shopName: string;
    logo: string;
    iban: string;
    accountNumber: string;
    bankName: string;
    country: string;
    city: string;
    state: string;
    district: string;
    location: MapLocation | null | undefined;
    songPrice: number;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      // Shop Owner Data
      name: shopAdminData.name || "",
      email: shopAdminData.email || "",
      phoneNumber: shopAdminData.phoneNumber || "",
      otherPhone: shopAdminData.otherPhone || "",
      commercialRegistrationNumber:
        shopAdminData.commercialRegistrationNumber || "",
      website: shopAdminData.website || "",
      image: shopAdminData.image || "",
      password: "",
      confirmPassword: "",
      // Shop Data
      shopName: shopData.name || "",
      logo: shopData.logo || "",
      iban: shopData.iban || "",
      accountNumber: shopData.accountNumber || "",
      bankName: shopData.bankName || "",
      country: shopData.country || "",
      city: shopData.city || "",
      district: shopData.district || "",
      location: shopData.location || null,
      songPrice: shopData.songPrice,
    },
  });
  const selectedCountry = watch("country");

  useEffect(() => {
    // Set up initial countries
    const allCountries = Country.getAllCountries();
    setCountries(
      allCountries.map((country) => ({
        value: country.isoCode,
        title: country.name,
      }))
    );
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setCities(
        countryStates.map((state) => ({
          value: state.isoCode,
          title: state.name,
        }))
      );
    }
  }, [selectedCountry]);

  const onSubmit = async (data: Inputs) => {
    setIsLoading(true);
    try {
      // Update shop owner data
      await updateUserData({
        id: shopAdminData.id,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        otherPhone: data.otherPhone,
        commercialRegistrationNumber: data.commercialRegistrationNumber,
        website: data.website,
        image: data.image,
        ...(data.password && { password: data.password }),
      });

      // Update shop data
      await updateShop({
        id: shopData.id,
        data: {
          name: data.shopName,
          logo: data.logo,
          iban: data.iban,
          accountNumber: data.accountNumber,
          bankName: data.bankName,
          country: data.country,
          city: data.city,
          district: data.district,
          location: data.location as any,
          songPrice: Number(data.songPrice),
        },
      });

      toast.success(t("Profile and shop information updated successfully"));
    } catch (error: any) {
      console.error(error);
      toast.error(t("Failed to update profile and shop information"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          if (Object.keys(errors).length > 0) {
            const firstErrorKey = Object.keys(errors)[0];
            const element = document.getElementById(firstErrorKey);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
              toast.error(t("Please correct the errors in the form"));
            }
          }
          console.log(errors); // This will log the errors to the console
        })}
      >
        <h2 className="text-xl font-semibold mb-4">
          {t("Shop Owner Information")}
        </h2>
        <Controller
          control={control}
          name="image"
          rules={{ required: t("This field is required") }}
          render={({ field }) => (
            <FileUploader
              defaultImageUrl={shopAdminData.image || ""}
              label={t("Profile Image")}
              onFileUpload={(url) => field.onChange(url)}
              errorMessage={errors.image?.message}
            />
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5">
          <Controller
            control={control}
            name="name"
            rules={{ required: t("This field is required") }}
            render={({ field }) => (
              <Input
                id="name"
                label={t("Name")}
                placeholder={t("Name")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{ required: t("This field is required") }}
            render={({ field }) => (
              <Input
                id="email"
                type="email"
                label={t("Email")}
                placeholder={t("Email")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <Input
                id="phoneNumber"
                label={t("Phone Number")}
                placeholder={t("Phone Number")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.phoneNumber?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="otherPhone"
            render={({ field }) => (
              <Input
                id="otherPhone"
                label={t("Other Phone")}
                placeholder={t("Other Phone")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.otherPhone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="commercialRegistrationNumber"
            render={({ field }) => (
              <Input
                id="commercialRegistrationNumber"
                label={t("Commercial Registration Number")}
                placeholder={t("Commercial Registration Number")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.commercialRegistrationNumber?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="website"
            render={({ field }) => (
              <Input
                id="website"
                label={t("Website")}
                placeholder={t("Website")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.website?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                id="password"
                label={t("Password")}
                placeholder={t("Password")}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.password?.message}
                autoComplete="new-password" // Add this line
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              validate: (value) =>
                value === getValues("password") || t("Passwords do not match"),
            }}
            render={({ field }) => (
              <Input
                id="confirmPassword"
                label={t("Confirm Password")}
                placeholder={t("Confirm Password")}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.confirmPassword?.message}
                autoComplete="off"
              />
            )}
          />
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-8">
          {t("Shop Information")}
        </h2>
        <Controller
          control={control}
          name="logo"
          rules={{ required: t("This field is required") }}
          render={({ field }) => (
            <FileUploader
              defaultImageUrl={shopData.logo || ""}
              label={t("Shop Logo")}
              onFileUpload={(url) => field.onChange(url)}
              errorMessage={errors.logo?.message}
            />
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5">
          <Controller
            control={control}
            name="shopName"
            rules={{ required: t("This field is required") }}
            render={({ field }) => (
              <Input
                id="shopName"
                label={t("Shop Name")}
                placeholder={t("Shop Name")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.shopName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="iban"
            render={({ field }) => (
              <Input
                id="iban"
                label={t("IBAN")}
                placeholder={t("IBAN")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.iban?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="accountNumber"
            render={({ field }) => (
              <Input
                id="accountNumber"
                label={t("Account Number")}
                placeholder={t("Account Number")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.accountNumber?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="bankName"
            render={({ field }) => (
              <Input
                id="bankName"
                label={t("Bank Name")}
                placeholder={t("Bank Name")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.bankName?.message}
              />
            )}
          />

          <Controller
            name="country"
            control={control}
            rules={{ required: t("This field is required") }}
            render={({ field }) => (
              <Select
                enableSearch
                {...field}
                id="country"
                label={t("Country")}
                options={countries}
                value={watch("country")}
                errMessage={errors.country?.message}
              />
            )}
          />

          <Controller
            name="city"
            control={control}
            rules={{ required: t("This field is required") }}
            render={({ field }) => (
              <Select
                enableSearch
                {...field}
                id="city"
                label={t("City")}
                options={cities}
                value={watch("city")}
                errMessage={errors.city?.message}
                disabled={!selectedCountry}
              />
            )}
          />
          <Controller
            control={control}
            name="songPrice"
            render={({ field }) => (
              <Input
                id="songPrice"
                label={t("Song Price") + " ($)"}
                type="number"
                placeholder={t("Default Song Price")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.songPrice?.message}
              />
            )}
          />
        </div>
        <h2 className="text-xl font-semibold mb-4 mt-8">
          {t("Shop Location")}
        </h2>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <div className="mb-5">
              <LocationMap
                setLocation={(value) => field.onChange(value)}
                location={field.value || undefined}
              />
              {errors.location && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.location.message}
                </p>
              )}
            </div>
          )}
        />

        <div className="flex justify-center mt-8 mb-10">
          <Button
            className="w-28 h-12 font-medium text-lg"
            isLoading={isLoading}
            type="submit"
          >
            {t("Save")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsMain;
