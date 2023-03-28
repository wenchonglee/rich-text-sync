# Rich Text Sync 

https://droplet.wenchonglee.dev/

To run locally, you'll need a `/backend/.env` file with `MONGO_URI` specified
```
cd backend && deno task dev
cd frontend && yarn dev
```


## TL;DR - How it works (WORK IN PROGRESS)

1. Frontend - with custom `tiptap` extensions, clients can create "@mention" nodes or highlight text to add "citations". This produces an HTML output that complies to a certain structure.
2. Backend - receives HTML and parses it for "references". Persist both the raw html and references to the document store
3. Backend - another service watches for changes to the referenced data and updates the HTML when necessary


## 1. Frontend using `tiptap`

### Mentions

Similar to modern apps, a list of users can be searched after typing `@`. Upon selecting a user, this HTML node is produced:

```html
<span 
  data-type="mention" 
  data-id="6396f18b6a3a195c2e4d772b"
  data-label="John doe"
>
  John doe
</span>
```

- `data-type` is self explanatory, but it also serves as an anchor for `tiptap` to parse this HTML node
- `data-id` is the user id
- `data-label` might be dropped, but should serve as a supplementary value if we need to present more data (e.g. user team)

While that HTML node is what is persisted, tiptap will render it with a custom component instead. Instead of plain text, it will:
- Link to the user on click
- Fetch and show a summary of the user on hover

### Citations

Upon highlighting text, a bubble menu will appear and present the user with the choice of citations. (UI not yet drafted)

Suppose the UI allows the user to find an existing `address` that they want to cite, this HTML node is produced:

```html
<span 
  data-type="citation" 
  data-id="123456b6a3a195c2e4d772d"
  data-summary="John doe's residential address: Sesame street 123"
  data-user-id="6396f18b6a3a195c2e4d772b"
  record-type="address"
>
  Lorem ipsum
</span>
```

- `data-type` is self explanatory, but it also serves as an anchor for `tiptap` to parse this HTML node
- `data-id` is the record id 
- `data-summary` is a summary of the data record it is citing from
- `data-user-id` is the user id that this record can be found in. This may not be necessary
- `record-type` is the type of record. This may not be necessary

While that HTML node is what is persisted, tiptap will render it slightly differently (currently not a custom react component yet).  
- It will have the familiar citation mark like this: Lorem ipsum <sup>[1]</sup>
- Drawing inspiration from Wikipedia, a list of citations can be found at the bottom of the post:
  ```
  1. John doe's residential address: Sesame street 123
  ```
- Clicking on the superscript <sup>[1]</sup> will bring focus to this list


## 2. Backend receiving HTML and parsing it

For example: after receiving a post that contains a mention node, this service will parse the HTML with:
```js
const mentionNodes = document.querySelectorAll("span[data-type='mention']");
// loop through DOM nodes to create an array..
```
 
Form the final output:
```json
{
  "content": "<span data-type=\"mention\" data-id=\"6396f18b6a3a195c2e4d772b\" data-label=\"John doe\">John doe</span>",
  "references": [
    {
      "id": "6396f18b6a3a195c2e4d772b",
      "type": "mention"
    }
  ]
}
```

## 3. Watching for changes

A separate service will use changestream to watch the `user` collection for changes. 
Anytime a user is updated, we enqueue a job to look for posts that needs to be updated (the queue component is not in this POC)

An example for mention nodes:
```js
// find posts that mention this user
const postsWithUser = postCollection.find({ "references.id": userId, "references.type": "mention" });

  // for each post, find the node to update
  const mentionNodes = document.querySelectorAll(`span[data-id='${userId}']`);
  // replace content of the node, data-label, etc
```

Because the sync is not expected to be timely and we can tolerate desyncs, this approach will be eventually consistent without performance costs when creating/updating posts.
 


## Other considerations to go through

- Access control
  - Is it okay to assume that the citation summary or username is always readable by users who don't have access to the specific records?
- What if we want to change the contract?
  - Renaming attributes, e.g. if we already had `data-id` for mentions but want to change to `data-user-id`
    - This should be fine as we can still find all of them, but the client needs be able to parse both until all data patches are complete
  - Adding attributes, e.g. adding `data-user-description` to mentions
    - Patching this will be more complex
    - Otherwise, the client can handle empty values and be fine with cases where descriptions are empty
  - Removing attributes, this is unlikely
    - Client can start by ignoring these attributes, patch jobs may not even be necessary 
- What if the reference is deleted?
  - Instead of updating the attributes, we can mark it as deleted (e.g. add an attribute `data-state="removed"`)
  - Using this, mention nodes no longer links to the non-existent user, and citation nodes can append to the summary with "[Removed]"


