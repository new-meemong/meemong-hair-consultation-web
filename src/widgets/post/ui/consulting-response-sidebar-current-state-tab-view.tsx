import Image from 'next/image';

export default function ConsultingResponseSidebarCurrentStateTabView() {
  const images = [
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
  ];

  return (
    <div className="flex flex-col gap-3 pb-8">
      {images.map((image, index) => (
        <Image
          key={`${image}-${index}`}
          src={image}
          alt="내 현재 머리 상태"
          className="size-62 object-cover"
          width={248}
          height={248}
        />
      ))}
    </div>
  );
}
