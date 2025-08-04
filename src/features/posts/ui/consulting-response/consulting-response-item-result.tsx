type ConsultingResponseItemResultProps = {
  label: string;
};

export default function ConsultingResponseItemResult({ label }: ConsultingResponseItemResultProps) {
  return (
    <div className="rounded-4 bg-alternative p-3 flex items-center justify-start">
      <p className="typo-body-2-medium text-label-sub">{label}</p>
    </div>
  );
}
