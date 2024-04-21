declare namespace svelteHTML {
  // enhance elements
  interface IntrinsicElements { }
  // enhance attributes
  interface HTMLAttributes<> {
      // If you want to use on:beforeinstallprompt
      'on:outsideclick'?: (event: MouseEvent) => void;
      // If you want to use myCustomAttribute={..} (note: all lowercase)
      // mycustomattribute?: any;
      // You can replace any with something more specific if you like
  }
}