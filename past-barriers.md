# 💯 Past Barriers

Problems, bugs and lessons learned when building this project.

## Overview

#### 1. Flash of un logged-in state before onAuthStateChanged verifies that an user is logged in

add in a 'loading' state

#### 2. Some weird `import module` bug

remove async from `export default async function Main() {`

```jsx
- export default async function Main() { // ...
+ export default function Main() { // ...
```

#### 3. Infinite redirect between `Home` and `SignIn` pages

turns out `typeof null` is `object`. WTF Javascript?

#### 4. If possible, use a icon library w/ JSX syntax, not raw .svg (cleaner, shorter code)

#### 5. How to useRef alongside react-hook-form (possible conflict)

[Solution by ReactHookForm themselves](https://www.react-hook-form.com/faqs/#Howtosharerefusage)

#### 6. Listen to input changes only after a key is pressed (`#`), and stop listening once another key is pressed (`Esc`).

```jsx
// simplified
const [extracted, setExtracted] = useState('');
const [isRecording, setIsRecording] = useState(false);

const handleKeyDown = (e) => {
  // attach to input
  if (e.key === '#') {
    setIsRecording(true);
  }
  if (e.key === 'Escape') {
    // stop recording
    setIsRecording(false);
    setExtracted('');
  }
};

useEffect(() => {
  if (isRecording) {
    setExtracted(input.value.slice(hashtagPosition, content.length));
  }
}, []);
```

#### 7. How to display a popup **at caret position** in an input field

1. Create a mirror div that looks exactly like the input,
2. Put input's content in a span in mirror div
3. Use coor of span as caret position (because you can't get position of a caret but you can get position of a span)

#### 8. `getBoundingClientRect()` returns position before animation ends

call `getBoundingClientRect` inside event `transitionEnd` instead

#### 9. How to build a masonry layout

- All cards have the same position at first render `{ left: 0, top: 0 }` (cards have `position: absolute`, `left` and `top` will be modified by `transform: translate()`).
- All cards have the same constant width `cardWidth`.
- Each card has access to position & dimension of all previous cards.
- In the first row, (when `i < numberOfColumns`) (`i` is card's index in an array from database), all cards have `top: 0`. Determine `left` from `i` and `cardWidth`.
- In lower rows, the rule of insertion is: a card should choose the most empty column to insert itself (i.e. choose the shortest column):
  1. Find the bottom card of each column by choosing the card with largest `bottom` (a property that you get from calling `getBoundingClientRect()`) among the cards with the same `left` (same `left` means same column).
  2. Choose the card with smallest `bottom`.
  3. From there you can determine the target card's `left` and `top`.

#### 10. How to pass props to not-defined-ahead-of-time children

use `React.cloneElement`:

```js
function Toggle({ content, children: input }) {
  const inputWithValue = cloneElement(input, { value: content });
  return <div>{inputWithValue}</div>;
}
```

#### 11. How to make a web scraper to get an URL's meta info

[Guide by Fireship](https://fireship.io/lessons/web-scraping-guide/)

#### 12. `Firebase Auth`: Avoid unnecessarily rendering children when currentUser (in context) is not initiated

[WebDevSimplified (Timestamp)](https://youtu.be/PKwu15ldZ7k?t=1528)

[SO post referring same video](https://stackoverflow.com/questions/68104551/react-firebase-authentication-and-usecontext)

#### 12. How to use `react-query`

