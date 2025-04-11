export async function submitForm(event, token) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const response = await fetch("/submit", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Pas de Content-Type ici
    },
    body: formData,
  });

  const result = await response.json();
  console.log(result);
}

export async function updateForm(event, token, id) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const response = await fetch("/articles/" + id + "/update", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, 
    },
    body: formData,
  });

  const result = await response.json();
  console.log(result);
}

export async function loginForm(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const response = await fetch("/login", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  console.log(result);
}

export async function registerForm(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
console.log(form);

  const response = await fetch("/register", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  console.log(result);
}

