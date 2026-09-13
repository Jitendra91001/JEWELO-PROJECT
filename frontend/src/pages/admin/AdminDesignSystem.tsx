import React, { useState } from "react";
import {
  Sparkles,
  Package,
  Layers,
  ShoppingBag,
  Heart,
  Eye,
  CheckCircle,
  AlertTriangle,
  Search,
  Plus,
  RefreshCcw,
  Shield,
  Gem,
  ArrowRight,
} from "lucide-react";
import {
  LuxuryHeading,
  LuxuryText,
  LuxuryKicker,
  LuxuryButton,
  LuxuryInput,
  LuxuryTextarea,
  LuxurySelect,
  LuxuryCard,
  LuxuryCardHeader,
  LuxuryCardTitle,
  LuxuryCardDescription,
  LuxuryCardContent,
  LuxuryCardFooter,
  LuxuryBadge,
  LuxuryModal,
  LuxuryDrawer,
  CustomTable,
  LuxuryFormControl,
  LuxuryProductCard,
  PriceDisplay,
  LuxuryRating,
  LuxuryBreadcrumb,
  LuxuryPagination,
  LuxurySkeleton,
  LuxuryProductCardSkeleton,
  LuxuryTableRowSkeleton,
  LuxuryEmptyState,
  LuxuryErrorState,
} from "@/components/elements";
import SEOHead from "@/components/common/SEOHead";

export const AdminDesignSystem: React.FC = () => {
  // Interactive component states
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ratingVal, setRatingVal] = useState(4.8);
  const [pageVal, setPageVal] = useState(1);
  const [tableSearch, setTableSearch] = useState("");
  const [activeMetalFilter, setActiveMetalFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("all");

  // Sample Table Data for CustomTable demonstration
  const sampleTableData = [
    {
      id: "1",
      name: "Solitaire Royal Diamond Ring",
      purity: "18K Yellow Gold",
      price: 185000,
      stock: 6,
      status: "In Vault",
      sku: "JWL-RNG-001",
    },
    {
      id: "2",
      name: "Celeste Emerald Pendant Necklace",
      purity: "22K Yellow Gold",
      price: 245000,
      stock: 2,
      status: "Low Stock",
      sku: "JWL-NCK-002",
    },
    {
      id: "3",
      name: "Aura Platinum Diamond Bangle",
      purity: "Platinum 950",
      price: 320000,
      stock: 0,
      status: "Out of Stock",
      sku: "JWL-BNG-003",
    },
    {
      id: "4",
      name: "Constellation Pearl Drop Earrings",
      purity: "18K Rose Gold",
      price: 95000,
      stock: 12,
      status: "In Vault",
      sku: "JWL-EAR-004",
    },
  ];

  const tableColumns = [
    {
      title: "Masterpiece Details",
      key: "name",
      render: (_: any, record: any) => (
        <div>
          <div className="font-display font-medium text-xs sm:text-sm text-foreground">
            {record.name}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
            {record.sku}
          </div>
        </div>
      ),
    },
    {
      title: "Metal Purity",
      key: "purity",
      render: (_: any, record: any) => (
        <LuxuryBadge variant="karat">{record.purity}</LuxuryBadge>
      ),
    },
    {
      title: "Price",
      key: "price",
      render: (_: any, record: any) => (
        <PriceDisplay amount={record.price} size="sm" />
      ),
    },
    {
      title: "Availability",
      key: "stock",
      render: (_: any, record: any) => (
        <LuxuryBadge
          variant={
            record.stock > 5 ? "inStock" : record.stock > 0 ? "lowStock" : "outOfStock"
          }
        >
          {record.stock > 0 ? `${record.stock} pieces` : "Sold Out"}
        </LuxuryBadge>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <LuxuryButton variant="link" size="xs">
          Inspect Piece
        </LuxuryButton>
      ),
    },
  ];

  return (
    <div className="space-y-12 pb-16 font-body">
      <SEOHead
        title="Luxury Design System | JEWELO"
        description="Complete high-end luxury jewellery brand design system, tokens, and 20 reusable UI components."
      />

      {/* Header Banner */}
      <div className="border-b border-[#EAE4DC] dark:border-[#2B2B2B] pb-8 pt-2">
        <LuxuryKicker withLines>MAISON DESIGN SYSTEM</LuxuryKicker>
        <LuxuryHeading
          as="h1"
          align="center"
          goldGradient
          subtitle="Official high-end jewellery brand UI system. Engineered with Tailwind CSS, Ant Design, generous whitespace, and delicate craftsmanship."
        >
          JEWELO Luxury Architecture
        </LuxuryHeading>

        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          <LuxuryBadge variant="gold">20 Components Created</LuxuryBadge>
          <LuxuryBadge variant="karat">Ant Design 5+ Theme</LuxuryBadge>
          <LuxuryBadge variant="certified">Tailwind CSS 3</LuxuryBadge>
          <LuxuryBadge variant="platinum">Universal CustomTable</LuxuryBadge>
        </div>
      </div>

      {/* 1. COLOR SYSTEM */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2">
          <LuxuryKicker>SECTION 01</LuxuryKicker>
          <LuxuryHeading as="h3">1. Precious Color Palette System</LuxuryHeading>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="h-16 rounded-lg bg-[#C5A880] shadow-sm flex items-center justify-center text-white font-mono text-[10px]">
              #C5A880
            </div>
            <div className="font-semibold text-xs">Champagne Gold</div>
            <div className="text-[10px] text-muted-foreground">Primary Maison Accent</div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="h-16 rounded-lg bg-[#997D4D] shadow-sm flex items-center justify-center text-white font-mono text-[10px]">
              #997D4D
            </div>
            <div className="font-semibold text-xs">Burnished Gold</div>
            <div className="text-[10px] text-muted-foreground">Antique Deep Accent</div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="h-16 rounded-lg bg-[#121212] shadow-sm flex items-center justify-center text-white font-mono text-[10px]">
              #121212
            </div>
            <div className="font-semibold text-xs">Obsidian Onyx</div>
            <div className="text-[10px] text-muted-foreground">Deep Luxury Dark</div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="h-16 rounded-lg bg-[#FAF7F2] border border-[#EAE4DC] shadow-sm flex items-center justify-center text-foreground font-mono text-[10px]">
              #FAF7F2
            </div>
            <div className="font-semibold text-xs">Warm Alabaster</div>
            <div className="text-[10px] text-muted-foreground">Light Surface & Header</div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="h-16 rounded-lg bg-[#E8B4B8] shadow-sm flex items-center justify-center text-foreground font-mono text-[10px]">
              #E8B4B8
            </div>
            <div className="font-semibold text-xs">Pearlescent Rose</div>
            <div className="text-[10px] text-muted-foreground">Romantic Metal Accent</div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="h-16 rounded-lg bg-[#2D5A43] shadow-sm flex items-center justify-center text-white font-mono text-[10px]">
              #2D5A43
            </div>
            <div className="font-semibold text-xs">Imperial Emerald</div>
            <div className="text-[10px] text-muted-foreground">Certification & Success</div>
          </div>
        </div>
      </section>

      {/* 2, 3 & 4. TYPOGRAPHY & HEADINGS & BODY */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2">
          <LuxuryKicker>SECTION 02, 03 & 04</LuxuryKicker>
          <LuxuryHeading as="h3">2. Typography, Heading & Body Styles</LuxuryHeading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LuxuryCard variant="masterpiece" className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#C5A880]">
              Serif Headings (Playfair Display)
            </h4>
            <div className="space-y-3">
              <LuxuryHeading as="h1" kicker="MAISON LEVEL 1">
                Display Title (H1)
              </LuxuryHeading>
              <LuxuryHeading as="h2" withDivider>
                Editorial Feature (H2)
              </LuxuryHeading>
              <LuxuryHeading as="h3">Collection Subheading (H3)</LuxuryHeading>
              <LuxuryHeading as="h4">Product Specification Title (H4)</LuxuryHeading>
              <LuxuryHeading as="h5">Drawer & Modal Header (H5)</LuxuryHeading>
              <LuxuryHeading as="h6">Micro Section Kicker (H6)</LuxuryHeading>
            </div>
          </LuxuryCard>

          <LuxuryCard variant="masterpiece" className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#C5A880]">
              Body Text Styles (Lato Sans)
            </h4>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-muted-foreground block mb-1">
                  VARIANT: LEAD
                </span>
                <LuxuryText variant="lead">
                  Every jewel crafted under the JEWELO hallmark is cut from certified conflict-free solitaires, set by master karigars with over three decades of ancestral heritage.
                </LuxuryText>
              </div>

              <div>
                <span className="text-[10px] font-mono text-muted-foreground block mb-1">
                  VARIANT: BODY
                </span>
                <LuxuryText variant="body">
                  Standard body text ensures maximum legibility across mobile screens and high-resolution displays with soft tracking and high contrast.
                </LuxuryText>
              </div>

              <div>
                <span className="text-[10px] font-mono text-muted-foreground block mb-1">
                  VARIANT: CAPTION & META
                </span>
                <LuxuryText variant="caption">
                  Dimensions: 18.2mm x 4.5mm. Weight: 4.85g. Purity: 18K Yellow Gold.
                </LuxuryText>
                <LuxuryText variant="meta" className="mt-1">
                  SKU: JWL-SLT-2026-VVS1 • AUTHENTICATED
                </LuxuryText>
              </div>

              <div>
                <span className="text-[10px] font-mono text-muted-foreground block mb-1">
                  VARIANT: QUOTE
                </span>
                <LuxuryText variant="quote">
                  "True luxury is not about excess, but about the purity of line and the timeless whisper of precious metal."
                </LuxuryText>
              </div>
            </div>
          </LuxuryCard>
        </div>
      </section>

      {/* 5. BUTTON VARIANTS */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2">
          <LuxuryKicker>SECTION 05</LuxuryKicker>
          <LuxuryHeading as="h3">5. Luxury Button Variants</LuxuryHeading>
        </div>

        <LuxuryCard variant="minimal" className="space-y-6">
          <div>
            <span className="text-xs text-muted-foreground font-semibold block mb-3">
              Variants in Standard Size (Medium):
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <LuxuryButton variant="primary-gold" leftIcon={<Sparkles size={14} />}>
                Primary Champagne
              </LuxuryButton>
              <LuxuryButton variant="obsidian" leftIcon={<ShoppingBag size={14} />}>
                Obsidian Black
              </LuxuryButton>
              <LuxuryButton variant="outline-gold" leftIcon={<Gem size={14} />}>
                Outline Gold
              </LuxuryButton>
              <LuxuryButton variant="ghost">Ghost Minimal</LuxuryButton>
              <LuxuryButton variant="link">Underline Link</LuxuryButton>
              <LuxuryButton variant="destructive">Destructive Action</LuxuryButton>
              <LuxuryButton variant="primary-gold" loading>
                Loading Action
              </LuxuryButton>
            </div>
          </div>

          <div>
            <span className="text-xs text-muted-foreground font-semibold block mb-3">
              Size Hierarchy (XS to LG):
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <LuxuryButton variant="outline-gold" size="xs">
                Size XS
              </LuxuryButton>
              <LuxuryButton variant="outline-gold" size="sm">
                Size SM
              </LuxuryButton>
              <LuxuryButton variant="primary-gold" size="md">
                Size MD (Default)
              </LuxuryButton>
              <LuxuryButton variant="obsidian" size="lg">
                Size LG (Grand CTA)
              </LuxuryButton>
            </div>
          </div>
        </LuxuryCard>
      </section>

      {/* 6 & 12. INPUT & FORM STYLES */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2">
          <LuxuryKicker>SECTION 06 & 12</LuxuryKicker>
          <LuxuryHeading as="h3">6 & 12. Input & Form Control Styles</LuxuryHeading>
        </div>

        <LuxuryCard variant="masterpiece">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <LuxuryFormControl
              label="Masterpiece Title"
              required
              tooltip="Official name displayed in catalogue"
              helperText="E.g. Royal Solitaire Diamond Ring"
            >
              <LuxuryInput
                placeholder="Enter masterpiece title..."
                prefixIcon={<Sparkles size={14} />}
              />
            </LuxuryFormControl>

            <LuxuryFormControl label="Search Vault SKU">
              <LuxuryInput
                placeholder="Search SKU..."
                prefixIcon={<Search size={14} />}
                onClear={() => {}}
                defaultValue="JWL-VVS1-009"
              />
            </LuxuryFormControl>

            <LuxuryFormControl
              label="Precious Metal Material"
              required
              error="Please select valid hallmarked metal"
            >
              <LuxurySelect
                options={[
                  { label: "18K Yellow Gold (Hallmarked)", value: "18k_yellow" },
                  { label: "22K Yellow Gold (916 BIS)", value: "22k_yellow" },
                  { label: "Platinum 950", value: "platinum_950" },
                  { label: "18K Rose Gold", value: "18k_rose" },
                ]}
              />
            </LuxuryFormControl>

            <div className="sm:col-span-2 lg:col-span-3">
              <LuxuryFormControl
                label="Artisan Gemstone Description"
                helperText="Provide clarity, cut, color, and carat grading specifications."
              >
                <LuxuryTextarea
                  placeholder="Describe the gemstone facets and artisanal setting..."
                  rows={3}
                />
              </LuxuryFormControl>
            </div>
          </div>
        </LuxuryCard>
      </section>

      {/* 7 & 8. CARDS & BADGES */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2">
          <LuxuryKicker>SECTION 07 & 08</LuxuryKicker>
          <LuxuryHeading as="h3">7 & 8. Card & Badge Styles</LuxuryHeading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LuxuryCard variant="masterpiece" withGlow>
            <LuxuryCardHeader>
              <div>
                <LuxuryBadge variant="karat">18K Yellow Gold</LuxuryBadge>
                <LuxuryCardTitle className="mt-2">Masterpiece Card</LuxuryCardTitle>
                <LuxuryCardDescription>
                  Subtle hairline border with gentle warm champagne glow on hover.
                </LuxuryCardDescription>
              </div>
            </LuxuryCardHeader>
            <LuxuryCardContent>
              <p className="text-xs text-muted-foreground">
                Card contents with structured hierarchy and generous breathing space.
              </p>
            </LuxuryCardContent>
            <LuxuryCardFooter>
              <PriceDisplay amount={145000} size="sm" />
              <LuxuryButton variant="outline-gold" size="xs">
                Inspect
              </LuxuryButton>
            </LuxuryCardFooter>
          </LuxuryCard>

          <LuxuryCard variant="spec">
            <LuxuryCardHeader>
              <div>
                <LuxuryBadge variant="certified">IGI Certified</LuxuryBadge>
                <LuxuryCardTitle className="mt-2">Specification Card</LuxuryCardTitle>
                <LuxuryCardDescription>
                  Warm alabaster background for metal & gemstone metrics.
                </LuxuryCardDescription>
              </div>
            </LuxuryCardHeader>
            <LuxuryCardContent className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span className="text-muted-foreground">Diamond Clarity:</span>
                <span className="font-semibold">VVS1 (Exceptional)</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span className="text-muted-foreground">Cut Grade:</span>
                <span className="font-semibold">Triple Excellent</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gold Net Weight:</span>
                <span className="font-semibold">6.42 Grams</span>
              </div>
            </LuxuryCardContent>
            <LuxuryCardFooter>
              <LuxuryBadge variant="inStock" dot>
                Vault Ready
              </LuxuryBadge>
            </LuxuryCardFooter>
          </LuxuryCard>

          <LuxuryCard variant="minimal">
            <LuxuryCardHeader>
              <div>
                <LuxuryBadge variant="obsidian">Limited Edition</LuxuryBadge>
                <LuxuryCardTitle className="mt-2">Badge Showcase</LuxuryCardTitle>
                <LuxuryCardDescription>
                  Full family of hallmark & stock status badges.
                </LuxuryCardDescription>
              </div>
            </LuxuryCardHeader>
            <LuxuryCardContent>
              <div className="flex flex-wrap gap-2">
                <LuxuryBadge variant="gold">Gold Accent</LuxuryBadge>
                <LuxuryBadge variant="karat">24K Pure</LuxuryBadge>
                <LuxuryBadge variant="certified">BIS Hallmark</LuxuryBadge>
                <LuxuryBadge variant="inStock" dot>
                  In Stock
                </LuxuryBadge>
                <LuxuryBadge variant="lowStock" dot>
                  Low Stock
                </LuxuryBadge>
                <LuxuryBadge variant="outOfStock" dot>
                  Sold Out
                </LuxuryBadge>
                <LuxuryBadge variant="platinum">Platinum 950</LuxuryBadge>
                <LuxuryBadge variant="obsidian">Maison Exclusive</LuxuryBadge>
              </div>
            </LuxuryCardContent>
          </LuxuryCard>
        </div>
      </section>

      {/* 9 & 10. MODAL & DRAWER */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2">
          <LuxuryKicker>SECTION 09 & 10</LuxuryKicker>
          <LuxuryHeading as="h3">9 & 10. Modal & Drawer Overlay Styles</LuxuryHeading>
        </div>

        <LuxuryCard variant="minimal" className="flex flex-wrap items-center gap-4">
          <LuxuryButton
            variant="primary-gold"
            onClick={() => setModalOpen(true)}
            leftIcon={<Sparkles size={14} />}
          >
            Launch Luxury Modal
          </LuxuryButton>

          <LuxuryButton
            variant="obsidian"
            onClick={() => setDrawerOpen(true)}
            leftIcon={<Layers size={14} />}
          >
            Open Slide-in Drawer
          </LuxuryButton>
        </LuxuryCard>

        {/* Live Modal */}
        <LuxuryModal
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          kicker="AUTHENTICITY CERTIFICATE"
          title="Solitaire Diamond Verification"
          subtitle="Certificate Number: GIA-2026-994821"
          footer={
            <div className="flex items-center justify-end gap-2 pt-2">
              <LuxuryButton variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                Close
              </LuxuryButton>
              <LuxuryButton variant="primary-gold" size="sm" onClick={() => setModalOpen(false)}>
                Download Certificate
              </LuxuryButton>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#181818] border border-[#C5A880]/30 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Laser Inscription:</span>
                <span className="font-mono font-bold">GIA 994821-EX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Carat Weight:</span>
                <span className="font-bold">1.52 Carat</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Color Grade:</span>
                <span className="font-bold">D (Colorless)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fluorescence:</span>
                <span className="font-bold">None</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              This certificate confirms that the gemstone has been independently examined by certified gemologists according to strict Maison standards.
            </p>
          </div>
        </LuxuryModal>

        {/* Live Drawer */}
        <LuxuryDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          kicker="VAULT CLIENT BAG"
          title="Your Reserved Masterpieces"
          subtitle="Pieces are secured in the boutique cart for 30 minutes"
          footerActions={
            <>
              <LuxuryButton variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>
                Continue Browsing
              </LuxuryButton>
              <LuxuryButton variant="primary-gold" size="sm" onClick={() => setDrawerOpen(false)}>
                Proceed to Checkout
              </LuxuryButton>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl border border-border flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-[#FAF7F2] border flex items-center justify-center text-[#C5A880]">
                <Gem size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-display font-medium text-xs truncate block">
                  Celeste Emerald Pendant Necklace
                </span>
                <span className="text-[10px] text-muted-foreground">18K Yellow Gold</span>
                <PriceDisplay amount={245000} size="sm" className="mt-1" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Boutique Subtotal:</span>
                <span className="font-bold">₹2,45,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Insured Vault Courier:</span>
                <span className="text-emerald-700 font-semibold">Complimentary</span>
              </div>
            </div>
          </div>
        </LuxuryDrawer>
      </section>

      {/* 11. THE MASTER CUSTOMTABLE */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2">
          <LuxuryKicker>SECTION 11 (CORE ARCHITECTURE)</LuxuryKicker>
          <LuxuryHeading as="h3">
            11. Universal CustomTable Component
          </LuxuryHeading>
          <p className="text-xs text-muted-foreground mt-1">
            Standardized table used across all Admin management views with global searching, filtering, and pagination.
          </p>
        </div>

        <CustomTable
          kicker="VAULT INVENTORY REPOSITORY"
          title="Catalogue Masterpieces"
          subtitle="Demonstrating global searching, dropdown filtering, luxury row styling, and pagination."
          columns={tableColumns}
          dataSource={sampleTableData.filter((item) => {
            const matchesSearch =
              item.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
              item.sku.toLowerCase().includes(tableSearch.toLowerCase());
            const matchesFilter =
              activeMetalFilter === "ALL" ||
              item.purity.toLowerCase().includes(activeMetalFilter.toLowerCase());
            return matchesSearch && matchesFilter;
          })}
          searchable
          searchValue={tableSearch}
          onSearch={setTableSearch}
          searchPlaceholder="Search masterpiece by name or SKU..."
          filters={[
            {
              key: "metal",
              label: "Metal",
              value: activeMetalFilter,
              onChange: setActiveMetalFilter,
              options: [
                { label: "All Precious Metals", value: "ALL" },
                { label: "Yellow Gold", value: "yellow" },
                { label: "Platinum", value: "platinum" },
                { label: "Rose Gold", value: "rose" },
              ],
            },
          ]}
          actions={
            <LuxuryButton
              variant="primary-gold"
              size="sm"
              leftIcon={<Plus size={13} />}
            >
              Add Piece
            </LuxuryButton>
          }
          pagination={{
            current: 1,
            pageSize: 5,
            total: 4,
            onChange: () => {},
          }}
        />
      </section>

      {/* 13 & 14 & 15. PRODUCT CARD & PRICE & RATING */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2">
          <LuxuryKicker>SECTION 13, 14 & 15</LuxuryKicker>
          <LuxuryHeading as="h3">
            13, 14 & 15. Product Card, Price & Rating Styles
          </LuxuryHeading>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <LuxuryProductCard
            id="demo-1"
            name="Solitaire Empress Ring in 18K"
            category="Rings"
            purity="18K Yellow Gold"
            material="1.2 Ct VVS1 Solitaire"
            price={185000}
            originalPrice={215000}
            image="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80"
            secondaryImage="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&auto=format&fit=crop&q=80"
            rating={4.9}
            reviewsCount={24}
            isNew
            onQuickView={() => setModalOpen(true)}
            onAddToCart={() => setDrawerOpen(true)}
          />

          <LuxuryProductCard
            id="demo-2"
            name="Aura Platinum Diamond Bangle"
            category="Bangles"
            purity="Platinum 950"
            material="Round Brilliant Diamonds"
            price={320000}
            image="https://images.unsplash.com/photo-1611591475877-628a8d795b8d?w=600&auto=format&fit=crop&q=80"
            rating={5.0}
            reviewsCount={18}
            onQuickView={() => setModalOpen(true)}
            onAddToCart={() => setDrawerOpen(true)}
          />

          <div className="space-y-6 flex flex-col justify-between">
            <LuxuryCard variant="masterpiece" className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#C5A880]">
                Price Display Variants
              </h4>
              <div className="space-y-3">
                <PriceDisplay amount={48500} size="sm" />
                <PriceDisplay
                  amount={185000}
                  originalPrice={220000}
                  size="md"
                  showEmi
                />
                <PriceDisplay
                  amount={450000}
                  originalPrice={500000}
                  size="lg"
                  karatNote="18K Certified Platinum"
                />
              </div>
            </LuxuryCard>

            <LuxuryCard variant="minimal" className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#C5A880]">
                Interactive Rating Component
              </h4>
              <div className="space-y-2">
                <LuxuryRating
                  value={ratingVal}
                  reviewsCount={48}
                  size="lg"
                  interactive
                  onChange={setRatingVal}
                />
                <p className="text-[11px] text-muted-foreground font-light">
                  Click on stars to test interactive rating selector. Current: {ratingVal.toFixed(1)} / 5.0
                </p>
              </div>
            </LuxuryCard>
          </div>
        </div>
      </section>

      {/* 16 & 17. BREADCRUMB & PAGINATION */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2">
          <LuxuryKicker>SECTION 16 & 17</LuxuryKicker>
          <LuxuryHeading as="h3">16 & 17. Breadcrumb & Pagination</LuxuryHeading>
        </div>

        <LuxuryCard variant="minimal" className="space-y-6">
          <div>
            <span className="text-xs text-muted-foreground font-semibold block mb-2">
              Breadcrumb Navigation Trail:
            </span>
            <LuxuryBreadcrumb
              items={[
                { label: "Boutique Collections", href: "/products" },
                { label: "High Jewellery Rings", href: "/products?cat=rings" },
                { label: "Solitaire Empress Ring 18K" },
              ]}
            />
          </div>

          <div className="border-t border-border pt-4">
            <span className="text-xs text-muted-foreground font-semibold block mb-2">
              Minimalist Luxury Pagination:
            </span>
            <LuxuryPagination
              current={pageVal}
              pageSize={10}
              total={84}
              onChange={(nextPage) => setPageVal(nextPage)}
            />
          </div>
        </LuxuryCard>
      </section>

      {/* 18. SKELETON LOADERS */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2">
          <LuxuryKicker>SECTION 18</LuxuryKicker>
          <LuxuryHeading as="h3">18. Champagne Shimmer Skeleton Loaders</LuxuryHeading>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <LuxuryProductCardSkeleton />
          <div className="sm:col-span-1 lg:col-span-2 bg-card rounded-2xl p-6 border border-border space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
              Table Row Shimmer State
            </h4>
            <LuxuryTableRowSkeleton columnsCount={4} />
            <LuxuryTableRowSkeleton columnsCount={4} />
            <LuxuryTableRowSkeleton columnsCount={4} />
          </div>
        </div>
      </section>

      {/* 19 & 20. EMPTY & ERROR STATES */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2">
          <LuxuryKicker>SECTION 19 & 20</LuxuryKicker>
          <LuxuryHeading as="h3">19 & 20. Empty & Error State Handling</LuxuryHeading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LuxuryEmptyState
            kicker="EXQUISITE SEARCH"
            title="No Matching Masterpieces"
            description="We could not discover pieces matching your current filters. Adjust metal karat or view full collection."
            actionLabel="Reset Boutique Filters"
            onAction={() => {}}
          />

          <div className="space-y-4">
            <LuxuryErrorState
              variant="banner"
              title="Vault Sync Notice"
              message="Price real-time bullion rate updated."
              onRetry={() => {}}
            />

            <LuxuryErrorState
              variant="card"
              title="Catalogue Retrieval Interrupted"
              message="Secure connection timed out while loading the diamond vault. Please refresh."
              onRetry={() => {}}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDesignSystem;
