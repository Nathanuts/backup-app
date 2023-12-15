addEventListener('fetch', (event) => {
	event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
	if (request.method === 'POST') {
	  const formData = await request.formData();
	  const user = formData.get('user');
	  const backup = formData.get('backup');
	  // Store the backup information in Workers KV
	  await se_backup.put(user, backup);
	  // Respond with a success message
	  return new Response('Backup information saved', { status: 200 });
	} else if (request.method === 'GET') {
	  const url = new URL(request.url);
	  const user = url.searchParams.get('user');
	  if (user) {
		// Retrieve the backup information from Workers KV
		const backup = await se_backup.get(user);
		// Generate and respond with a results page
		return new Response(`Backup for ${user}: ${backup}`, { status: 200 });
	  } else {
		const landingPage = `
		  <!DOCTYPE html>
		  <html>
		  <head>
		  <script src="https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.umd.min.js"></script>
			<title>Backup Form</title>
			<style>
			  body {
				font-family: Arial, sans-serif;
				margin: 20px;
			  }
			
			  h1 {
				margin-bottom: 20px;
			  }
			
			  label {
				display: block;
				margin-bottom: 10px;
			  }
			
			  input[type="text"] {
				width: 300px;
				padding: 5px;
				font-size: 16px;
			  }
			
			  input[type="submit"] {
				padding: 10px 20px;
				font-size: 16px;
				background-color: #4CAF50;
				color: #fff;
				border: none;
				cursor: pointer;
			  }
			</style>
		  </head>
		  <body>

			<h1> Salesmen's Secret Weapon to Track Down Backup SE </h1>

			<h2>Backup Form</h2>
			<form id="backupForm" action="" method="post">
			  <label for="user">User:</label>
			  <select id="user" name="user" required>
			  	<option value="nathan">Nathan</option>
				<option value="claire">Claire</option>
				<option value="agnes">Agnes</option>
				<option value="szerong">Sze Rong</option>
				<option value="wenshan">Wen Shan</option>
				<option value="pong">Pong</option>
			  </select>
			  <br>
			
			<h3>Dates</h3>
			<input id="datepicker"/>
    		<script>
      		const picker = new easepick.create({
        	element: document.getElementById('datepicker'),
        		css: [
          		'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css',
        		],
				plugins: ['RangePlugin'],
        		RangePlugin: {
          			tooltip: true,
        		},
      		});
	  		</script>
			<br>
				<label for="backup">Backup:</label>
			  	<input type="text" id="backup" name="backup" required>
			  <input type="submit" value="Submit">
			</form>
			
			<h2>Search Backup</h2>
			<form id="searchForm" action="/" method="get">
			  <label for="user">Search User:</label>
			  <select id="user" name="user" required>
			  	<option value="nathan">Nathan</option>
				<option value="claire">Claire</option>
				<option value="agnes">Agnes</option>
				<option value="szerong">Sze Rong</option>
				<option value="wenshan">Wen Shan</option>
				<option value="pong">Pong</option>
			  </select>
			  <input type="submit" value="Search">
			</form>

			<script>
			  const form = document.getElementById('backupForm');
			  const searchForm = document.getElementById('searchForm');

			  form.addEventListener('submit', async (event) => {
				event.preventDefault();
			
				const user = document.getElementById('user').value;
				const backup = document.getElementById('backup').value;
			
				// Send the form data as a POST request to the server
				const response = await fetch('/', {
				  method: 'POST',
				  body: new FormData(form),
				});
			
				if (response.ok) {
				  alert('Backup information saved');
				  // Reset the form after successful submission
				  form.reset();
				} else {
				  alert('Failed to save backup information');
				}
			  });
			</script>
		  </body>
		  </html>
		`;
		// Generate and respond with the landing page
		return new Response(landingPage, { status: 200, headers: { 'Content-Type': 'text/html' } });
	  }
	} else {
	  // Method not allowed
	  return new Response('Method not allowed', { status: 405 });
	}
  }