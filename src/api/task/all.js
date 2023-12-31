import request from '@/utils/request'

export function listTable(query) {
	return request({
		url: '/task/detail/list',
		method: 'get',
		params: query
	})
}

export function deleteTask(id) {
	return request({
		url: '/task/detail/delete/' + id,
		method: 'delete',
	})
}

export function updateTask(data) {
	return request({
		url: '/task/detail/edit',
		method: 'post',
		data,
	})
}

export function addTaskComplete(data) {
	return request({
		url: '/task/detail/complete',
		method: 'post',
		data,
	})
}

export function addTask(data) {
	return request({
		url: '/task/detail/add',
		method: 'post',
		data,
	})
}

export function getTaskDetailsById(id) {
	return request({
		url: '/task/detail/getInfo/' + id,
		method: 'get',
		params: { id }
	})
}

