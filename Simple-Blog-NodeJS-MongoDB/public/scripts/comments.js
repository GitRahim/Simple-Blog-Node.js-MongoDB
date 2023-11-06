const loadCommentsBtnEl = document.getElementById("load-comments-btn");
const commentsSecionEl = document.getElementById("comments");
const commentsFormEl = document.querySelector("#comments-form form");
const commentTitleEl = document.getElementById("title");
const commentTextEl = document.getElementById("text");

function createCommentsList(comments) {
  const commentListEl = document.createElement("ol");

  for (const comment of comments) {
    const commentEl = document.createElement("li");
    commentEl.innerHTML = `
        <article class="comment-item">
            <h2>${comment.title}</h2>
            <p>${comment.text}</p>
        </article>
      `;
    commentListEl.appendChild(commentEl);
  }
  return commentListEl;
}

async function fetchCommentsForPost() {
  const postId = loadCommentsBtnEl.dataset.postid;
  try {
    const response = await fetch(`/posts/${postId}/comments`);
    const responseData = await response.json();

    if (!response.ok) {
      alert("Fetching comments failed!");
      return;
    }

    if (responseData && responseData.length > 0) {
      const commentsListEl = createCommentsList(responseData);
      commentsSecionEl.innerHTML = "";
      commentsSecionEl.appendChild(commentsListEl);
    } else {
      commentsSecionEl.firstElementChild.textContent =
        "We couldn't find any comments! You can add one!";
    }
  } catch (error) {
    alert("Getting comments failed!");
  }
}

async function saveComment(event) {
  event.preventDefault();
  const postId = loadCommentsBtnEl.dataset.postid;
  const enteredTitle = commentTitleEl.value;
  const enteredText = commentTextEl.value;

  const comment = { title: enteredTitle, text: enteredText };

  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      fetchCommentsForPost();
      commentTitleEl.value = commentTextEl.value = "";
    } else {
      alert("Could not send comment!");
    }
  } catch (error) {
    alert("Could not send request! ");
  }
}

loadCommentsBtnEl.addEventListener("click", fetchCommentsForPost);
commentsFormEl.addEventListener("submit", saveComment);
