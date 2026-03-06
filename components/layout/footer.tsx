export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 px-6 py-6 md:h-24 md:flex-row md:px-8 md:py-0 lg:px-10">
        <p className="text-center text-sm text-muted-foreground md:text-left ml-6">
          E-commerce Fullstack Web App — Portfolio project
        </p>
        <p className="text-right text-muted-foreground md:ml-auto md:text-right">
          Built with Next.js, TypeScript, Tailwind, Prisma
        </p>
      </div>
    </footer>
  );
}
