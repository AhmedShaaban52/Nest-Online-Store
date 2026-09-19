export function getUnsplashImage(name: string): string {
  const n = name.toLowerCase();
  
  if (n.includes('headphone') || n.includes('ear') || n.includes('audio') || n.includes('headset')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60';
  }
  if (n.includes('keyboard') || n.includes('typing') || n.includes('board') || n.includes('keycap')) {
    return 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60';
  }
  if (n.includes('chair') || n.includes('seat') || n.includes('stool') || n.includes('desk')) {
    return 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=500&auto=format&fit=crop&q=60';
  }
  if (n.includes('monitor') || n.includes('screen') || n.includes('display') || n.includes('tv')) {
    return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60';
  }
  if (n.includes('hub') || n.includes('usb') || n.includes('cable') || n.includes('charger') || n.includes('adapter')) {
    return 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&auto=format&fit=crop&q=60';
  }
  if (n.includes('speaker') || n.includes('sound') || n.includes('music') || n.includes('subwoofer')) {
    return 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60';
  }
  if (n.includes('phone') || n.includes('mobile') || n.includes('smartphone') || n.includes('iphone')) {
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60';
  }
  if (n.includes('mouse') || n.includes('trackpad') || n.includes('clicker')) {
    return 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60';
  }
  if (n.includes('laptop') || n.includes('computer') || n.includes('macbook') || n.includes('pc')) {
    return 'https://images.unsplash.com/photo-1496181130204-755241524eab?w=500&auto=format&fit=crop&q=60';
  }
  if (n.includes('watch') || n.includes('clock') || n.includes('time') || n.includes('fitbit')) {
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
  }
  if (n.includes('shoe') || n.includes('sneaker') || n.includes('boot') || n.includes('nike')) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60';
  }
  if (n.includes('camera') || n.includes('lens') || n.includes('photo')) {
    return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60';
  }
  if (n.includes('bottle') || n.includes('flask') || n.includes('water') || n.includes('mug')) {
    return 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60';
  }
  if (n.includes('bag') || n.includes('backpack') || n.includes('suitcase') || n.includes('pack')) {
    return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60';
  }

  // Fallback to a high quality generic product image from Unsplash
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
}
