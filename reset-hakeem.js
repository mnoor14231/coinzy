// Reset Hakeem Account Data Script
// Run this in browser console to reset hakeem account to fresh state

console.log('🔄 Resetting Hakeem account to fresh state...');

// Clear all Zustand stores
localStorage.removeItem('coinzy-auth-storage');
localStorage.removeItem('coinzy-game-storage');
localStorage.removeItem('coinzy-character-storage');

console.log('✅ Hakeem account reset complete!');
console.log('🔄 Please refresh the page to see fresh account.');

// Alternative: Clear everything
// localStorage.clear();

// Instructions for manual reset:
console.log(`
📋 MANUAL RESET INSTRUCTIONS:
1. Open browser console (F12)
2. Run: localStorage.clear()
3. Refresh the page
4. Login with: حكيم / 12 (parent) or حكيم / 123 (child)
`); 