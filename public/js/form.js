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

  if(response.redirected){
    window.location.href = response.url
  }
  else{
    const result = await response.json();
    alert(result.error);
  }
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
  if(response.redirected){
    window.location.href = response.url
  }
  else{
    const result = await response.json();
    alert(result.error);
  }
}

export async function loginForm(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const response = await fetch("/login", {
    method: "POST",
    body: formData,
  });

  if(response.redirected){
    window.location.href = response.url
  }
  else{
    const result = await response.json();
    alert(result.error);
  }
}

export async function registerForm(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const response = await fetch("/register", {
    method: "POST",
    body: formData,
  });

  if(response.redirected){
    window.location.href = response.url
  }
  else{
    const result = await response.json();
    alert(result.error);
  }
}

