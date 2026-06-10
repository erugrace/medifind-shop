import { Link, useRouterState } from "@tanstack/react-router";
import { Bot, MapPin, Package, ShoppingCart, Sparkles, Store, Stethoscope, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCart } from "@/hooks/use-cart";

const items = [
  { title: "Marketplace", url: "/", icon: Search },
  { title: "Ask Chatbot", url: "/chat", icon: Bot },
  { title: "Buy Physical", url: "/buy-physical", icon: MapPin },
  { title: "Cart", url: "/cart", icon: ShoppingCart },
  { title: "My Orders", url: "/orders", icon: Package },
  { title: "AI Tool", url: "/ai-tool", icon: Sparkles },
  { title: "Sell", url: "/sell", icon: Store },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { itemCount } = useCart();
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Stethoscope className="size-4" />
          </span>
          {!collapsed && (
            <span className="font-display text-lg font-bold tracking-tight text-sidebar-foreground" style={{ fontFamily: "var(--font-display)" }}>
              MediFind
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={currentPath === item.url} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                  {item.url === "/cart" && itemCount > 0 && !collapsed && (
                    <SidebarMenuBadge className="bg-primary text-primary-foreground">{itemCount}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-3 pb-4">
        {!collapsed && (
          <p className="text-xs text-muted-foreground">Medical equipment, found faster.</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
