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

export function deleteMulTask(data) {
	return request({
		url: '/task/detail/deleteTaskDetailByIds',
		method: 'post',
		data
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

export function addTaskRating(data) {
	return request({
		url: '/task/detail/evaluateTaskById',
		method: 'post',
		data,
	})
}

export function getTaskRatingHistory(id) {
	return request({
		url: '/task/detail/queryEvaluateByTaskId/' + id,
		method: 'get',
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

