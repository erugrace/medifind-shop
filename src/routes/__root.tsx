import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { LogIn, LogOut, Package, ShoppingCart, UserRound } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { CartProvider, useCart } from "@/hooks/use-cart";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { CatalogProvider } from "@/hooks/use-catalog";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MediFind — Medical Equipment Marketplace" },
      { name: "description", content: "Find and buy medical equipment fast — for individuals, hospitals, physiotherapists and healthcare professionals." },
      { name: "author", content: "MediFind" },
      { property: "og:title", content: "MediFind — Medical Equipment Marketplace" },
      { property: "og:description", content: "Find and buy medical equipment fast — for individuals, hospitals and healthcare professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: appIcon },
      { rel: "apple-touch-icon", href: appIcon },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function HeaderCartButton() {
  const { itemCount } = useCart();
  return (
    <Link
      to="/cart"
      className="relative inline-flex size-9 items-center justify-center rounded-lg border bg-card text-foreground transition-colors hover:bg-accent"
      aria-label="Cart"
    >
      <ShoppingCart className="size-4" />
      {itemCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

function HeaderAccountButton() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <Link
        to="/auth"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        <LogIn className="size-4" /> Sign in
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex size-9 items-center justify-center rounded-lg border bg-card text-foreground transition-colors hover:bg-accent"
          aria-label="Account menu"
        >
          <UserRound className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/orders" className="flex items-center gap-2">
            <Package className="size-4" /> My orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void signOut()}>
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CatalogProvider>
          <CartProvider>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex min-w-0 flex-1 flex-col">
                  <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur">
                    <SidebarTrigger />
                    <Link
                      to="/"
                      className="text-base font-bold tracking-tight md:hidden"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      MediFind
                    </Link>
                    <div className="ml-auto flex items-center gap-2">
                      <HeaderCartButton />
                      <HeaderAccountButton />
                    </div>
                  </header>
                  <main className="flex-1">
                    {/* Required: nested routes render here. */}
                    <Outlet />
                  </main>
                </div>
              </div>
              <Toaster position="bottom-right" />
            </SidebarProvider>
          </CartProvider>
        </CatalogProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
