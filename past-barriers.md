# 💯 Past Barriers

Problems, bugs and lessons learned when building this project.

## Overview

### 1. Flash of un logged-in state before onAuthStateChanged verifies that an user is logged in
- Solution: add in a 'loading' state

### 2. Some weird `import module` bug
- Solution: remove async from `export default async function Main() {`
```jsx
- export default async function Main() { // ...
+ export default function Main() { // ...
```

### 3. Infinite redirect between `Home` and `SignIn` pages
- Solution: turns out `typeof null` is `object`. WTF Javascript?

### 4. If possible, use a icon library w/ JSX syntax, not raw .svg (cleaner, shorter code)

### 5. How to useRef alongside react-hook-form (possible conflict)
- [Solution](https://www.react-hook-form.com/faqs/#Howtosharerefusage)

### 6. How to display a popup at caret position in an input field