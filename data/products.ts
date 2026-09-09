import type { Product } from '@/types';

// Re-export Product so imports from '@/data/products' resolve cleanly across all components
export type { Product };

export const PRODUCTS: Product[] = [
  {
    id: 'prod_cw_mech_01',
    name: 'Craftware Precision Mech-TKL',
    slug: 'craftware-precision-mech-tkl',
    category: 'Keyboards',
    price: 139.0,
    currency: 'USD',
    sku: 'CW-KB-TKL87',
    stockStatus: 'IN_STOCK',
    shortDescription:
      'CNC aluminum chassis with hot-swappable tactile switches engineered for high-cadence workflows.',
    description:
      'The Precision Mech-TKL is built inside an anodized 6063 aerospace aluminum case with sound-dampening poron foam gaskets and factory-lubed tactile switches rated for 80M keystrokes.',
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
    specifications: {
      Layout: 'Tenkeyless (87 Keys)',
      Connectivity: 'Detachable Braided USB-C / 1000Hz Polling',
      'Switch Type': 'Craftware Custom Factory-Lubed Tactile (55g)',
      'Plate Mount': 'Gasket-mounted polycarbonate',
      Weight: '1.24 kg',
    },
    featured: true,
    tags: ['ergonomic', 'tkl', 'mechanical', 'quiet-tactile'],
  },
  {
    id: 'prod_cw_mouse_02',
    name: 'Apex Dual-Mode Ergonomic Mouse',
    slug: 'apex-dual-mode-mouse',
    category: 'Mice',
    price: 89.0,
    currency: 'USD',
    sku: 'CW-MS-APEX',
    stockStatus: 'IN_STOCK',
    shortDescription:
      'PAW3395 optical sensor with thumb-wheel side navigation and silent tactile microswitches.',
    description:
      'Form-factor sculpted for 8+ hour operational productivity. Features frictionless switching between 2.4GHz low-latency wireless and Bluetooth 5.3 alongside an infinite horizontal scroll carousel.',
    image:
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80',
    specifications: {
      Sensor: 'PAW3395 (Up to 26,000 DPI)',
      'Battery Life': 'Up to 110 hours on USB-C fast charge',
      Switches: 'Optical-mechanical rated for 90M clicks',
      Weight: '78g',
    },
    featured: true,
    tags: ['mouse', 'wireless', 'ergonomic', 'precision'],
  },
  {
    id: 'prod_cw_hub_03',
    name: 'Modular 12-in-1 Thunderbolt 4 Dock',
    slug: 'modular-12-in-1-tb4-dock',
    category: 'Connectivity',
    price: 249.0,
    currency: 'USD',
    sku: 'CW-DK-TB4',
    stockStatus: 'IN_STOCK',
    shortDescription:
      '40Gbps enterprise workstation hub supporting dual 4K60 displays and 100W Power Delivery.',
    description:
      'Monolithic heatsink enclosure preventing thermal throttling during sustained NVMe and 2.5GbE network transfers. Integrated safety rails protect host devices against voltage fluctuations.',
    image:
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1000&q=80',
    specifications: {
      Upstream: 'Thunderbolt 4 (40Gbps, 100W PD to Host)',
      'Display Outs': '2x DisplayPort 1.4, 1x HDMI 2.1',
      Networking: '2.5Gbps RJ45 Ethernet',
      Storage: 'M.2 PCIe Gen4 NVMe slot under toolless heat shroud',
    },
    featured: true,
    tags: ['docking station', 'thunderbolt', 'usb-c', 'workstation'],
  },
  {
    id: 'prod_cw_cam_04',
    name: 'Aperture 4K Conference Webcam',
    slug: 'aperture-4k-webcam',
    category: 'Audio & Video',
    price: 189.0,
    currency: 'USD',
    sku: 'CW-VC-4KPRO',
    stockStatus: 'LOW_STOCK',
    shortDescription:
      'Sony STARVIS 2 sensor with physical mechanical privacy shutter and beamforming quad-mics.',
    description:
      'Calibrated for enterprise conference rooms and executive workstations. Preserves low-noise color balance in dim environments without aggressive digital artifacts.',
    image:
      'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=1000&q=80',
    specifications: {
      Sensor: '1/1.8" Sony STARVIS 2 CMOS',
      Resolution: '4K @ 30fps / 1080p @ 60fps HDR',
      'Field of View': 'Adjustable 65° / 78° / 90°',
      Privacy: 'Hardwired electromagnetic sliding shutter',
    },
    featured: false,
    tags: ['webcam', '4k', 'conferencing', 'hdr'],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}