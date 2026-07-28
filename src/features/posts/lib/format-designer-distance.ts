export default function formatDesignerDistance(distanceInMeters: number | null | undefined) {
  if (distanceInMeters == null || !Number.isFinite(distanceInMeters) || distanceInMeters < 0) {
    return null;
  }

  const distanceInKilometers = distanceInMeters / 1000;
  const formattedDistance = Number.isInteger(distanceInKilometers)
    ? distanceInKilometers.toFixed(0)
    : distanceInKilometers.toFixed(1);

  return `${formattedDistance}Km`;
}
