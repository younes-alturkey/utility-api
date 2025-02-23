import KVInMemory from '@/lib/kv-inmemory'
import { HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class KVService {
  kvInMemory = null

  constructor() {
    this.kvInMemory = KVInMemory
  }

  // Method to retrieve all users and send the response
  getKeyValue(res, query) {
    try {
      // Retrieve all users from the in-memory key-value storage
      const value = this.kvInMemory.get(query.key)

      // Send a successful response with the users data
      return res.status(HttpStatus.OK).json({
        success: true, // Indicate the operation was successful
        status: HttpStatus.OK, // HTTP status code for success (200)
        data: {
          key: query.key,
          value: value,
        },
      })
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error in getting key value data: ', error)

      // Send an error response with details about the failure
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false, // Indicate the operation failed
        status: HttpStatus.INTERNAL_SERVER_ERROR, // HTTP status code for server error (500)
        message: 'Something went wrong', // Generic error message for the client
        raw:
          error?.toString() || // Raw error message, if available
          'No raw error message available.', // Fallback message if error details are missing
      })
    }
  }

  addKeyValue(res, body) {
    try {
      const keyValue = body

      if (
        !keyValue ||
        (typeof keyValue === 'object' && Object.keys(keyValue).length === 0)
      )
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: HttpStatus.BAD_REQUEST,
          message: 'Key value data is required.',
        })

      this.kvInMemory.add(keyValue.key, keyValue.value)

      // Send a successful response with the users data
      return res.status(HttpStatus.OK).json({
        success: true, // Indicate the operation was successful
        status: HttpStatus.OK, // HTTP status code for success (200)
        data: {
          key: keyValue.key,
          value: keyValue.value,
        },
      })
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error in adding key value data: ', error)

      // Send an error response with details about the failure
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false, // Indicate the operation failed
        status: HttpStatus.INTERNAL_SERVER_ERROR, // HTTP status code for server error (500)
        message: 'Something went wrong', // Generic error message for the client
        raw:
          error?.toString() || // Raw error message, if available
          'No raw error message available.', // Fallback message if error details are missing
      })
    }
  }

  deleteKeyValue(res, query) {
    try {
      this.kvInMemory.delete(query.key)

      return res.status(HttpStatus.OK).json({
        success: true,
        status: HttpStatus.OK,
        message: 'Key value data deleted successfully.',
        data: {
          key: query.key,
        },
      })
    } catch (error) {
      console.error('Error in deleting key value data: ', error)

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {
          key: query.key,
        },
        message: 'Something went wrong',
        raw:
          error?.toString() || // Raw error message, if available
          'No raw error message available.', // Fallback message if error details are missing
      })
    }
  }

  getAllKeyValue(res) {
    try {
      const allKeyValue = this.kvInMemory.getAll()
      return res.status(HttpStatus.OK).json({
        success: true,
        status: HttpStatus.OK,
        data: allKeyValue,
      })
    } catch (error) {
      console.error('Error in getting all key value data: ', error)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        raw:
          error?.toString() || // Raw error message, if available
          'No raw error message available.', // Fallback message if error details are missing
      })
    }
  }
}
