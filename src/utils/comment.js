const body2 = [
  {
    id: 8,
    likes: null,
    userId: 7,
    content: "this is the tweet 2",
    userName: "@Test24322",
    replyToId: null,
    conversationId: 8,
  },
  {
    id: 9,
    likes: null,
    userId: 7,
    content: "this is the reply 1 tweet 2",
    userName: "@Test24322",
    replyToId: 8,
    conversationId: 8,
  },
  {
    id: 10,
    likes: null,
    userId: 7,
    content: "this is the reply 2 tweet 2",
    userName: "@Test24322",
    replyToId: 8,
    conversationId: 8,
  },
  {
    id: 12,
    likes: null,
    userId: 7,
    content: "this is the reply 1 to reply of 1 tweet 2",
    userName: "@Test24322",
    replyToId: 9,
    conversationId: 8,
  },
];

const flatComments = [
  {
    id: 8,
    name: "demo4",
    level: 1,
    likes: null,
    userId: 7,
    content: "this is the tweet 2",
    replyToId: null,
  },
  {
    id: 7,
    name: "demo4",
    level: 2,
    likes: null,
    userId: 7,
    content: "reply to main tweet",
    replyToId: 1,
  },
  {
    id: 9,
    name: "demo4",
    level: 2,
    likes: null,
    userId: 7,
    content: "this is the reply 1 tweet 2",
    replyToId: 8,
  },
  {
    id: 10,
    name: "demo4",
    level: 2,
    likes: null,
    userId: 7,
    content: "this is the reply 2 tweet 2",
    replyToId: 8,
  },
  {
    id: 12,
    name: "demo4",
    level: 3,
    likes: null,
    userId: 7,
    content: "this is the reply 1 to reply of 1 tweet 2",
    replyToId: 9,
  },
  {
    id: 5,
    name: "demo4",
    level: 4,
    likes: null,
    userId: 7,
    content: "this is the reply to comment id 4",
    replyToId: 4,
  },
  {
    id: 6,
    name: "demo4",
    level: 4,
    likes: null,
    userId: 7,
    content: "this is the reply to comment id 2",
    replyToId: 4,
  },
  {
    id: 1,
    name: "demo4upt65",
    level: 1,
    likes: null,
    userId: 8,
    content: "this is the tweet ",
    replyToId: null,
  },
  {
    id: 2,
    name: "demo4upt65",
    level: 2,
    likes: null,
    userId: 8,
    content: "this is the commnt to tweet",
    replyToId: 1,
  },
  {
    id: 3,
    name: "demo4upt65",
    level: 2,
    likes: null,
    userId: 8,
    content: "this is the commnt 2 to tweet",
    replyToId: 1,
  },
  {
    id: 4,
    name: "demo4upt65",
    level: 3,
    likes: null,
    userId: 8,
    content: "this is the reply to comment 1",
    replyToId: 2,
  },
];
// console.log(JSON.stringify(buildCommentTree(body2), null, 2));
export default function buildCommentTree(comments) {
  const commentMap = {}; // The Lookup Table
  const tree = []; // The final output

  // Step 1: Initialize the Map
  // We loop through every comment to create a direct reference to it
  comments.forEach((comment) => {
    comment.comment.children = []; // Initialize empty children array
    commentMap[comment.comment.commentId] = comment.comment; // Add to map
  });

  // Step 2: Link Children to Parents
  comments.forEach((comment) => {
    // Check if this comment is a reply
    if (comment.comment.replyTo) {
      // Look up the parent in our Map
      const parent = commentMap[comment.comment.replyTo];

      // If parent exists, add this comment to their children
      if (parent) {
        parent.children.push(comment);
      } else {
        // Edge Case: The parent might be deleted or not loaded.
        // You can choose to attach these to the root or hide them.
        // For now, let's treat them as top-level or 'orphaned'.
        tree.push(comment);
      }
    } else {
      // It has no parent, so it's a Root (Top Level) comment
      tree.push(comment);
    }
  });

  return tree;
}

