<% modules[name].forEach(function(key){ %>
		<%- include('modules/' + key + '.js') %>
<% }) %>