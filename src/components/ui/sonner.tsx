import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      expand={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg " +
            "data-[type=normal]:bg-background " +
            "data-[type=success]:bg-green-100 dark:data-[type=success]:bg-green-900 " +
            "data-[type=warning]:bg-yellow-100 dark:data-[type=warning]:bg-yellow-800/60 " +
            "data-[type=error]:bg-red-100 dark:data-[type=error]:bg-destructive/60 " +
            "data-[type=info]:bg-blue-100 dark:data-[type=info]:bg-blue-900",

          description: "group-[.toast]:text-foreground-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-foreground-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };