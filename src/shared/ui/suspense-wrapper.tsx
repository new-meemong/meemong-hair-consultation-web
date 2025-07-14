// import { Suspense, type ReactNode } from 'react';
// import { Skeleton } from '@/shared/ui/skeleton';
// import { Loader } from '@/shared';

// export function PageLoading() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-dimmer">
//       <div className="flex flex-col items-center p-2 bg-label-default rounded-10">
//         <Loader size="md" theme="light" />
//       </div>
//     </div>
//   );
// }

// export function PostLoading() {
//   return (
//     <div className="py-5 px-5 space-y-6">
//       {Array.from({ length: 3 }).map((_, i) => (
//         <div key={i} className="py-3 space-y-5">
//           <div className="flex space-x-4">
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-5/6" />
//               <Skeleton className="h-4 w-4/5" />
//             </div>
//             <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
//           </div>
//           <div className="flex items-center space-x-4">
//             <Skeleton className="h-3 w-5" />
//             <Skeleton className="h-3 w-5" />
//             <Skeleton className="h-3 w-5" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export function CommentLoading() {
//   return (
//     <div className="space-y-3">
//       {Array.from({ length: 5 }).map((_, i) => (
//         <div key={i} className="flex space-x-3">
//           <Skeleton className="h-8 w-8 rounded-full" />
//           <div className="flex-1 space-y-2">
//             <Skeleton className="h-3 w-1/4" />
//             <Skeleton className="h-3 w-3/4" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // Suspense 래퍼 컴포넌트
// interface SuspenseWrapperProps {
//   children: ReactNode;
//   fallback?: ReactNode;
//   type?: 'page' | 'post' | 'comment' | 'spinner';
// }

// export function SuspenseWrapper({ children, fallback, type = 'spinner' }: SuspenseWrapperProps) {
//   const getFallback = () => {
//     if (fallback) return fallback;

//     switch (type) {
//       case 'page':
//         return <PageLoading />;
//       case 'post':
//         return <PostLoading />;
//       case 'comment':
//         return <CommentLoading />;
//       default:
//         return <Loader />;
//     }
//   };

//   return <Suspense fallback={getFallback()}>{children}</Suspense>;
// }
