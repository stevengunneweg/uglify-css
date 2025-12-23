const tests = `
Should mark the following simple cases:
It should mark inline occurrence p-1 and also inside a string "p-1 p-1 and p-1" 
A class reference like in document.querySelect('.p-1') should also be marked
As a potential value \`the value is: p-1\`
As class with modifier \`the value is: p-1:other or other:p-1\`
A class with selector .p-1[data-test^="test"] should mark the selector

Should mark the following escaped cases:
It should mark inline occurrence escaped-class\:m-1 and also inside a string "escaped-class\:m-1 escaped-class\:m-1 and escaped-class\:m-1"
A class reference like in document.querySelect('.escaped-class\:m-1') should also be marked
As a potential value \`the value is: escaped-class\:m-1\`
A class with modifier escaped-class\:m-1:other or other:escaped-class\:m-1
A class with selector .escaped-class\:m-1[data-test^="test"] should mark the selector
A class with escaped selector .escaped-class\\:m-1[data-test^="test"] should mark the selector
A class with multiple escaped selector .escaped-class\\\\\:m-1[data-test^="test"] should mark the selector

Should mark the following Tailwind cases:
It should mark inline occurrence tailwind-class-\[#value\] and also inside a string "tailwind-class-\[#value\] tailwind-class-\[#value\] and tailwind-class-\[#value\]"
It should mark inline occurrence \\[\\&\\>\\*\\]\\:text-left and also inside a string "\\[\\&\\>\\*\\]\\:text-left \\[\\&\\>\\*\\]\\:text-left and \\[\\&\\>\\*\\]\\:text-left"

Should mark cases with states:
It should mark inline occurrence with-state:hover and also inside a string "with-state:hover with-state:hover and with-state:hover"

Should not mark the following cases:
When followed by more text like no-matching it should not be marked
When preceded by more text like ohno-match it should not be marked either
Inside a css variable var(--testing, no-match) it should not be marked
When inside a minified script (function(p,m){r[n?no-match:p]=m} it should not be marked
`;
