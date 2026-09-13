import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Address } from "../models";
import { AuthenticatedRequest } from "../types";

export const getAddresses = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const addresses = await Address.find({ user: req.user.id, isDeleted: false }).sort({
    isDefaultShipping: -1,
    createdAt: -1,
  });

  return ApiResponse.success(res, "Addresses retrieved successfully", addresses);
});

export const getAddressById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { id } = req.params;
  const address = await Address.findOne({ _id: id, user: req.user.id, isDeleted: false });

  if (!address) {
    throw ApiError.notFound("Address not found");
  }

  return ApiResponse.success(res, "Address retrieved successfully", address);
});

export const createAddress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const {
    name,
    fullName,
    phone,
    alternatePhone,
    line1,
    addressLine1,
    line2,
    addressLine2,
    landmark,
    city,
    state,
    pincode,
    postalCode,
    country = "India",
    addressType = "HOME",
    isDefault = false,
  } = req.body;

  const count = await Address.countDocuments({ user: req.user.id, isDeleted: false });
  const shouldBeDefault = isDefault || count === 0;

  if (shouldBeDefault) {
    await Address.updateMany(
      { user: req.user.id },
      { isDefaultShipping: false, isDefaultBilling: false }
    );
  }

  const address = await Address.create({
    user: req.user.id,
    fullName: fullName || name,
    phone,
    alternatePhone,
    addressLine1: addressLine1 || line1,
    addressLine2: addressLine2 || line2,
    landmark,
    city,
    state,
    postalCode: postalCode || pincode,
    country,
    addressType,
    isDefaultShipping: shouldBeDefault,
    isDefaultBilling: shouldBeDefault,
  });

  return ApiResponse.created(res, "Address created successfully", address);
});

export const updateAddress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { id } = req.params;
  const address = await Address.findOne({ _id: id, user: req.user.id, isDeleted: false });

  if (!address) {
    throw ApiError.notFound("Address not found");
  }

  const {
    name,
    fullName,
    phone,
    alternatePhone,
    line1,
    addressLine1,
    line2,
    addressLine2,
    landmark,
    city,
    state,
    pincode,
    postalCode,
    country,
    addressType,
    isDefault,
  } = req.body;

  if (fullName || name) address.fullName = fullName || name;
  if (phone) address.phone = phone;
  if (alternatePhone !== undefined) address.alternatePhone = alternatePhone;
  if (addressLine1 || line1) address.addressLine1 = addressLine1 || line1;
  if (addressLine2 !== undefined || line2 !== undefined) address.addressLine2 = addressLine2 || line2;
  if (landmark !== undefined) address.landmark = landmark;
  if (city) address.city = city;
  if (state) address.state = state;
  if (postalCode || pincode) address.postalCode = postalCode || pincode;
  if (country) address.country = country;
  if (addressType) address.addressType = addressType;

  if (isDefault) {
    await Address.updateMany(
      { user: req.user.id, _id: { $ne: id } },
      { isDefaultShipping: false, isDefaultBilling: false }
    );
    address.isDefaultShipping = true;
    address.isDefaultBilling = true;
  }

  await address.save();
  return ApiResponse.success(res, "Address updated successfully", address);
});

export const deleteAddress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { id } = req.params;
  const address = await Address.findOne({ _id: id, user: req.user.id, isDeleted: false });

  if (!address) {
    throw ApiError.notFound("Address not found");
  }

  address.isDeleted = true;
  address.deletedAt = new Date();
  await address.save();

  return ApiResponse.success(res, "Address deleted successfully");
});

export const setDefaultAddress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { id } = req.params;
  const address = await Address.findOne({ _id: id, user: req.user.id, isDeleted: false });

  if (!address) {
    throw ApiError.notFound("Address not found");
  }

  await Address.updateMany(
    { user: req.user.id },
    { isDefaultShipping: false, isDefaultBilling: false }
  );

  address.isDefaultShipping = true;
  address.isDefaultBilling = true;
  await address.save();

  return ApiResponse.success(res, "Default address set successfully", address);
});
