import { CreateBorrowerRequest } from '@src/interfaces/borrower.interface';
import { Borrower } from '@src/models/borrower.entity';
import { Repository } from 'typeorm/repository/Repository';

export class BorrowerService {
    private readonly borrowerRepository: Repository<Borrower>;

    constructor(borrowerRepository: Repository<Borrower>) {
        this.borrowerRepository = borrowerRepository;
    }

    public async createBorrower(createBorrowerRequest: CreateBorrowerRequest) {
        const borrower = new Borrower();
        borrower.name = createBorrowerRequest.name;
        return this.borrowerRepository.save(borrower);
    }

    public async getBorrower(borrowerId: string) {
        if (!borrowerId) {
            return null;
        }
        return this.borrowerRepository.findOne({
            where: {
                id: borrowerId
            }
        });
    }
}
