import { cn } from '@/lib/utils';

function Button({
  type = 'button',
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(
        'flex py-3 w-full justify-center items-center rounded-2 typo-body-1-semibold text-white',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type ReportFormButtonBoxProps = {
  onCancel: () => void;
};

export default function ReportFormButtonBox({ onCancel }: ReportFormButtonBoxProps) {
  return (
    <div className="flex gap-3 justify-items-stretch px-5 pb-5 pt-3 shadow-strong">
      <Button className="bg-label-info" onClick={onCancel}>
        취소
      </Button>
      <Button type="submit" className="bg-negative-light">
        신고하기
      </Button>
    </div>
  );
}
